# Whimsical Bear

A cozy, woodland-themed daily quote delivery app. Each day, an AI-generated morning whisper and a bear portrait arrive in subscribers' inboxes (or as an SMS) at a time of their choosing. Logged-in users can explore **The Burrow** — an immersive bear-den dashboard with interactive hotspots.

## Features

- **Daily whispers** — Claude generates a unique, nature-grounded morning quote each day; falls back to a curated pool when the API is unavailable.
- **Bear portraits** — DALL-E 3 paints a new bear portrait every morning; a static fallback is served when the API is unavailable.
- **Email & SMS delivery** — Resend handles rich HTML emails; Twilio handles SMS. Users choose one or both channels.
- **Flexible schedule** — Subscribers pick which days of the week and which time slot they want: dawn, morning, midday, afternoon, or evening.
- **Magic-link auth** — Supabase handles sign-up and sign-in; no passwords required.
- **The Burrow** — A logged-in dashboard rendered as an interactive SVG bear den:
  - **Window** — reads today's whisper from the database.
  - **Bookshelf** — browses the archive ("The Bear's Journal") of the last 30 quotes.
  - **Mailbox** — adjusts delivery rhythm (days, time, channel).
- **Ambient music** — a looping background audio track persists across all pages.
- **Idempotent dispatch** — a `delivery_log` table with a unique constraint prevents duplicate sends even if the cron fires twice.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS, Framer Motion |
| Auth & Database | Supabase (Postgres + Auth) |
| Quote generation | Anthropic Claude API |
| Image generation | OpenAI DALL-E 3 |
| Email | Resend |
| SMS | Twilio |
| Hosting & Cron | Vercel |

## Project Structure

```
app/
  page.tsx                  Root — renders HomeRouter (redirects logged-in users to The Burrow)
  layout.tsx                Global fonts (Lora + Nunito) and ambient music player
  api/
    signup/route.ts         POST — creates auth user + profile row
    cron/dispatch/route.ts  GET  — daily dispatch cron (Vercel)
  actions/
    updatePreferences.ts    Server action — saves delivery settings
  auth/                     Supabase auth callback
  settings/                 Delivery settings page (authenticated)
components/
  LandingPage.tsx           Public landing page (bear scene, quote, sign-up form)
  HomeRouter.tsx            Decides whether to show LandingPage or BurrowScene
  burrow/BurrowScene.tsx    Interactive logged-in dashboard
  SignupForm.tsx            Email / phone / preferred-time sign-up form
  DeliverySettings.tsx      Delivery rhythm form (days, time, channel)
  BackgroundMusic.tsx       Persistent ambient audio player
  AnimatedBear.tsx          Animated SVG bear for the landing scene
  BearScene.tsx             Bear scene wrapper
  QuoteCard.tsx             Styled daily quote display
  BackgroundDecor.tsx       Decorative background elements
  DuckEasterEgg.tsx         Hidden duck easter egg
  AuthCallbackClient.tsx    Handles the Supabase magic-link redirect
lib/
  content.ts                generateMoment() — calls Claude + DALL-E 3
  email.ts                  sendEmail() — Resend REST API
  sms.ts                    sendSMS() — Twilio REST API
  supabase.ts               Supabase client singleton
```

## Database

Run the following SQL in your Supabase project to create the required tables.

```sql
-- Daily content (one row per day)
CREATE TABLE IF NOT EXISTS daily_moments (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  date       DATE        UNIQUE NOT NULL DEFAULT CURRENT_DATE,
  quote      TEXT        NOT NULL,
  image_url  TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE daily_moments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read daily moments" ON daily_moments
  FOR SELECT TO anon USING (true);

-- Delivery log — prevents duplicate sends (UNIQUE constraint is the true guard)
CREATE TABLE IF NOT EXISTS delivery_log (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  moment_id  UUID        REFERENCES daily_moments(id) ON DELETE CASCADE,
  channel    TEXT        NOT NULL CHECK (channel IN ('email', 'sms')),
  sent_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, moment_id, channel)
);
ALTER TABLE delivery_log ENABLE ROW LEVEL SECURITY;
-- No public policies — service role only.

-- User profiles
CREATE TABLE IF NOT EXISTS profiles (
  id                UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email             TEXT,
  phone             TEXT,
  delivery_method   TEXT        NOT NULL DEFAULT 'email' CHECK (delivery_method IN ('email', 'sms', 'both')),
  is_subscribed     BOOLEAN     NOT NULL DEFAULT true,
  preferred_time    TEXT        NOT NULL DEFAULT 'morning'
                                CHECK (preferred_time IN ('dawn', 'morning', 'midday', 'afternoon', 'evening')),
  days_of_week      TEXT[]      NOT NULL DEFAULT '{mon,tue,wed,thu,fri,sat,sun}',
  unsubscribe_token UUID        DEFAULT gen_random_uuid()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

## Environment Variables

Create a `.env.local` file at the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # used by the cron — bypasses RLS

# AI
ANTHROPIC_API_KEY=              # Claude quote generation
OPENAI_API_KEY=                 # DALL-E 3 bear portrait

# Email (Resend)
RESEND_API_KEY=
RESEND_FROM_EMAIL=              # e.g. "Whimsical Bear <bear@yourdomain.com>"

# SMS (Twilio)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_MESSAGING_SERVICE_SID=

# App
NEXT_PUBLIC_APP_URL=            # e.g. https://whimsical-bear.vercel.app
CRON_SECRET=                    # Vercel injects this automatically for cron routes
```

If `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` are absent, the app falls back gracefully — a quote is picked from a built-in pool and `/bear-portrait.png` is served as the image.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Daily Dispatch Cron

Vercel fires `GET /api/cron/dispatch` five times per day at the following UTC hours:

| UTC hour | Slot      |
|---|---|
| 05:00 | dawn      |
| 08:00 | morning   |
| 12:00 | midday    |
| 15:00 | afternoon |
| 19:00 | evening   |

On each run the cron:
1. Fetches or creates today's `daily_moments` row (quote + bear portrait).
2. Queries `profiles` for subscribers whose `preferred_time` matches the current slot and whose `days_of_week` includes today.
3. Sends email and/or SMS per each subscriber's `delivery_method`.
4. Writes a `delivery_log` row; the unique constraint silently prevents double-sends.

The cron is protected by the `CRON_SECRET` environment variable — Vercel injects it as a `Bearer` token in the `Authorization` header.

## Scripts

```bash
npm run dev    # Start development server
npm run build  # Production build
npm run start  # Start production server
npm run lint   # Run ESLint
```
