import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Server-side client — uses the anon key.
// The profiles table must have an INSERT policy that permits this role,
// or swap NEXT_PUBLIC_SUPABASE_ANON_KEY for a service-role key server-side.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export async function POST(request: Request) {
  const { email, phone, preferred_time } = await request.json()

  if (!email) {
    return NextResponse.json(
      { error: 'An email is needed to find your woodland path.' },
      { status: 400 },
    )
  }

  // ── 1. Create the auth user ─────────────────────────────────────────────────
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    // A random password keeps the account secure without exposing it.
    // Users receive their daily quote by email — no login needed.
    password: crypto.randomUUID(),
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      data: { phone: phone || null, preferred_time: preferred_time || 'morning' },
    },
  })

  if (authError) {
    // Supabase returns this message when the email is already registered
    const alreadyExists =
      authError.message.toLowerCase().includes('already registered') ||
      authError.message.toLowerCase().includes('user already exists') ||
      authError.status === 422

    if (alreadyExists) {
      return NextResponse.json(
        {
          error:
            'It looks like this forest path has already been traveled — try logging in!',
        },
        { status: 409 },
      )
    }

    console.error('[signup] auth error:', authError)
    return NextResponse.json(
      { error: 'Something stirred in the woodland — please try again.' },
      { status: 500 },
    )
  }

  const userId = authData.user?.id
  if (!userId) {
    return NextResponse.json(
      { error: 'Something stirred in the woodland — please try again.' },
      { status: 500 },
    )
  }

  // ── 2. Insert profile row ───────────────────────────────────────────────────
  // Requires the profiles table + an INSERT policy (see README / Supabase SQL).
  const { error: profileError } = await supabase.from('profiles').insert({
    id: userId,
    email,
    phone: phone || null,
    preferred_time: preferred_time || 'morning',
  })

  if (profileError) {
    // Auth user was created — log and continue so the user isn't left hanging.
    console.error('[signup] profile insert error:', profileError)
  }

  // ── 3. Success ──────────────────────────────────────────────────────────────
  return NextResponse.json(
    {
      message:
        'Welcome to the woodland! Your daily moment of calm is on its way.',
    },
    { status: 201 },
  )
}
