import BackgroundDecor from '@/components/BackgroundDecor'
import BearScene       from '@/components/BearScene'
import QuoteCard       from '@/components/QuoteCard'
import SignupForm      from '@/components/SignupForm'

// Future: replace with a server-side fetch from the Quote API.
// import { getDailyQuote } from '@/lib/api'
// const { quote, date } = await getDailyQuote()
const DAILY_QUOTE =
  'The creek is unhurried this morning, and for now, so are you.'

// Future: fetch today's AI-generated illustration URL and pass to BearScene.
// const illustrationUrl = await getDailyImage()

export default function Home() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month:   'long',
    day:     'numeric',
  })

  return (
    <main className="page-bg relative min-h-screen overflow-x-hidden flex flex-col items-center px-5 pt-12 pb-16">

      {/* ── Background decoration — trees + duck, behind all content ─────── */}
      <BackgroundDecor />

      {/* ── App header ───────────────────────────────────────────────────── */}
      <header className="fade-in text-center mb-2">
        <h1 className="font-serif font-bold text-deep-brown text-xl sm:text-2xl tracking-wide">
          Whimsical Bear
        </h1>
        <p className="font-sans text-coffee text-xs tracking-widest uppercase mt-1">
          A daily moment of calm
        </p>
      </header>

      {/* ── Bear scene illustration ───────────────────────────────────────
           The float animation and fade-in stagger are purely CSS — no JS.
           Future: pass illustrationUrl prop to BearScene once AI images are live.
      ────────────────────────────────────────────────────────────────────── */}
      <section
        aria-hidden="true"
        className="fade-in-d1 w-full flex justify-center -mb-6 relative z-10"
      >
        <BearScene />
      </section>

      {/* ── Quote card ───────────────────────────────────────────────────── */}
      {/* Future: pass server-fetched quote and date here. */}
      <section
        aria-label="Today's inspiration"
        className="fade-in-d2 w-full max-w-lg relative z-20"
      >
        <QuoteCard quote={DAILY_QUOTE} date={today} />
      </section>

      {/* ── Supporting tagline ───────────────────────────────────────────── */}
      <p className="fade-in-d3 font-sans text-forest text-sm mt-5 mb-7 text-center max-w-xs leading-relaxed">
        Each morning, a quiet thought from the woodland —{' '}
        <span className="text-moss">delivered to you.</span>
      </p>

      {/* ── Signup form ──────────────────────────────────────────────────────
           Future: wrap with session check — if already subscribed, show
           notification preferences instead.
      ─────────────────────────────────────────────────────────────────────── */}
      <section
        aria-label="Sign up for daily inspirations"
        className="fade-in-d4 w-full max-w-sm"
      >
        <SignupForm />
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="mt-12 text-center">
        <p className="font-sans text-xs text-coffee tracking-wide">
          &copy; {new Date().getFullYear()} Whimsical Bear
          &ensp;&middot;&ensp;
          Made with quiet care
        </p>
      </footer>

    </main>
  )
}
