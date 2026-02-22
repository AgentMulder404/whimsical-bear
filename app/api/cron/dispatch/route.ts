// ── Whimsical Bear — Daily Dispatch Cron ──────────────────────────────────────
//
// Runs every hour via Vercel Cron (see vercel.json).
// At each "delivery window" hour it:
//   1. Gets or creates today's daily moment (quote + image)
//   2. Finds every profile whose preferred_time matches NOW and whose
//      days_of_week array contains today's day key
//   3. Dispatches email and/or SMS per the user's delivery_method
//   4. Logs each delivery to prevent duplicate sends (idempotency)
//
// ── Required Supabase SQL ──────────────────────────────────────────────────────
//
//   CREATE TABLE IF NOT EXISTS daily_moments (
//     id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
//     date       DATE        UNIQUE NOT NULL DEFAULT CURRENT_DATE,
//     quote      TEXT        NOT NULL,
//     image_url  TEXT,
//     created_at TIMESTAMPTZ DEFAULT NOW()
//   );
//   ALTER TABLE daily_moments ENABLE ROW LEVEL SECURITY;
//   CREATE POLICY "Public can read daily moments" ON daily_moments
//     FOR SELECT TO anon USING (true);
//
//   CREATE TABLE IF NOT EXISTS delivery_log (
//     id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
//     user_id    UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
//     moment_id  UUID        REFERENCES daily_moments(id) ON DELETE CASCADE,
//     channel    TEXT        NOT NULL CHECK (channel IN ('email','sms')),
//     sent_at    TIMESTAMPTZ DEFAULT NOW(),
//     UNIQUE (user_id, moment_id, channel)
//   );
//   ALTER TABLE delivery_log ENABLE ROW LEVEL SECURITY;
//   -- No public policies — service role only.
//
// ── Required env vars ──────────────────────────────────────────────────────────
//
//   SUPABASE_SERVICE_ROLE_KEY  — bypasses RLS to query all profiles
//   CRON_SECRET                — Vercel injects this as Bearer token
//   RESEND_API_KEY
//   RESEND_FROM_EMAIL          — e.g. "Whimsical Bear <bear@yourdomain.com>"
//   TWILIO_ACCOUNT_SID
//   TWILIO_AUTH_TOKEN
//   TWILIO_FROM_NUMBER         — E.164, e.g. "+15550001234"
//   NEXT_PUBLIC_APP_URL        — e.g. "https://whimsical-bear.vercel.app"
//
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse }              from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { generateMoment }           from '@/lib/content'
import { sendEmail }                from '@/lib/email'
import { sendSMS }                  from '@/lib/sms'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// ── Delivery window mapping ────────────────────────────────────────────────────
// Keys must match the values stored in profiles.preferred_time.

const HOUR_TO_SLOT: Record<number, string> = {
  6:  'dawn',
  9:  'morning',
  12: 'midday',
  15: 'afternoon',
  18: 'dusk',
}

// Matches the day keys stored in profiles.days_of_week (0 = Sunday)
const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const

// ── Handler ───────────────────────────────────────────────────────────────────

export async function GET(request: Request) {

  // ── Auth: reject anything that isn't Vercel's own cron call ─────────────────
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.warn('[woodland:dispatch] An uninvited visitor knocked at the gate. Turning away.')
    return NextResponse.json({ error: 'The gate is locked.' }, { status: 401 })
  }

  const now         = new Date()
  const currentHour = now.getUTCHours()
  const todaySlot   = HOUR_TO_SLOT[currentHour]
  const todayKey    = DAY_KEYS[now.getUTCDay()]
  const todayDate   = now.toISOString().split('T')[0]   // "YYYY-MM-DD"

  // Only proceed during a defined delivery window
  if (!todaySlot) {
    console.log(`[woodland:dispatch] The ${currentHour}:00 UTC hour holds no deliveries. The forest rests.`)
    return NextResponse.json({
      message: `Hour ${currentHour}:00 UTC is not a delivery window. The forest rests.`,
    })
  }

  console.log(`[woodland:dispatch] The ${todaySlot} bell rings for ${todayKey}. Preparing the day's moment...`)

  // Service-role client — bypasses RLS so we can read all profiles
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  // ── Step 1: Get or create today's daily moment ───────────────────────────────
  const moment = await getOrCreateMoment(supabase, todayDate)
  if (!moment) {
    return NextResponse.json(
      { error: 'The woodland could not conjure today\'s moment.' },
      { status: 500 },
    )
  }

  // ── Step 2: Find eligible travelers ─────────────────────────────────────────
  // Profiles whose preferred_time matches this delivery slot AND whose
  // days_of_week array contains today's day key.
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, email, phone, delivery_method')
    .eq('preferred_time', todaySlot)
    .contains('days_of_week', [todayKey])

  if (profilesError) {
    console.error('[woodland:dispatch] Could not read the woodland registry:', profilesError.message)
    return NextResponse.json(
      { error: 'Could not query the woodland registry.' },
      { status: 500 },
    )
  }

  console.log(`[woodland:dispatch] ${profiles.length} traveler(s) await their ${todaySlot} moment.`)

  // ── Step 3: Dispatch ─────────────────────────────────────────────────────────
  const tally = { sent: 0, skipped: 0, failed: 0 }

  for (const profile of profiles) {
    const channels: Array<'email' | 'sms'> =
      profile.delivery_method === 'both'  ? ['email', 'sms'] :
      profile.delivery_method === 'sms'   ? ['sms']          :
                                            ['email']

    for (const channel of channels) {

      // ── Idempotency check ──────────────────────────────────────────────────
      // The UNIQUE constraint on delivery_log(user_id, moment_id, channel)
      // is the true guard. This pre-check saves an unnecessary API call.
      const { data: alreadySent } = await supabase
        .from('delivery_log')
        .select('id')
        .eq('user_id',   profile.id)
        .eq('moment_id', moment.id)
        .eq('channel',   channel)
        .maybeSingle()

      if (alreadySent) {
        console.log(
          `[woodland:dispatch] Traveler ${profile.id} already received their ${channel} today — the bear does not visit twice.`,
        )
        tally.skipped++
        continue
      }

      // ── Send ───────────────────────────────────────────────────────────────
      try {
        if (channel === 'email') {
          if (!profile.email) { tally.skipped++; continue }
          await sendEmail({
            to:       profile.email,
            quote:    moment.quote,
            imageUrl: moment.image_url,
            date:     todayDate,
          })
        } else {
          if (!profile.phone) { tally.skipped++; continue }
          await sendSMS({
            to:    profile.phone,
            quote: moment.quote,
            date:  todayDate,
          })
        }

        // ── Record delivery (also enforces idempotency at DB level) ──────────
        const { error: logError } = await supabase
          .from('delivery_log')
          .insert({ user_id: profile.id, moment_id: moment.id, channel })

        if (logError && logError.code !== '23505') {
          // 23505 = unique_violation — harmless race condition, already sent
          console.warn(`[woodland:dispatch] Could not inscribe delivery for ${profile.id}:`, logError.message)
        }

        console.log(`[woodland:${channel}] A message has set off through the trees for traveler ${profile.id}.`)
        tally.sent++

      } catch (err) {
        console.error(`[woodland:${channel}] The message lost its way for traveler ${profile.id}:`, err)
        tally.failed++
      }
    }
  }

  const summary = `The ${todaySlot} dispatch is complete — sent: ${tally.sent}, skipped: ${tally.skipped}, failed: ${tally.failed}.`
  console.log(`[woodland:dispatch] ${summary}`)

  return NextResponse.json({ message: summary, ...tally })
}

// ── Content helper ─────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getOrCreateMoment(supabase: SupabaseClient<any>, date: string) {
  // If today's moment already exists, reuse it — all delivery windows share it
  const { data: existing } = await supabase
    .from('daily_moments')
    .select('*')
    .eq('date', date)
    .maybeSingle()

  if (existing) {
    console.log('[woodland:content] Today\'s moment already rests in the bark. The forest is consistent.')
    return existing
  }

  // Generate a fresh moment and persist it
  console.log('[woodland:content] Carving a new moment into the bark...')
  const { quote, image_url } = await generateMoment()

  const { data: created, error } = await supabase
    .from('daily_moments')
    .insert({ date, quote, image_url })
    .select()
    .single()

  if (error) {
    // Handle race condition: two concurrent cron calls may both try to insert
    if (error.code === '23505') {
      console.log('[woodland:content] Another traveler carved the moment first. Fetching it now.')
      const { data: raceWinner } = await supabase
        .from('daily_moments')
        .select('*')
        .eq('date', date)
        .single()
      return raceWinner
    }
    console.error('[woodland:content] The bark resisted:', error.message)
    return null
  }

  console.log('[woodland:content] Today\'s moment has been set into the tree.')
  return created
}
