import BackgroundDecor from '@/components/BackgroundDecor'
import BearScene       from '@/components/BearScene'
import QuoteCard       from '@/components/QuoteCard'
import SignupForm      from '@/components/SignupForm'

const DAILY_QUOTE =
  'The creek is unhurried this morning, and for now, so are you.'

export default function LandingPage() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month:   'long',
    day:     'numeric',
  })

  return (
    <main className="page-bg relative min-h-screen overflow-x-hidden flex flex-col items-center px-5 pt-12 pb-16">

      <BackgroundDecor />

      <header className="fade-in text-center mb-2">
        <h1 className="font-serif font-bold text-deep-brown text-xl sm:text-2xl tracking-wide">
          Whimsical Bear
        </h1>
        <p className="font-sans text-coffee text-xs tracking-widest uppercase mt-1">
          A daily moment of calm
        </p>
      </header>

      <section
        aria-hidden="true"
        className="fade-in-d1 w-full flex justify-center -mb-6 relative z-10"
      >
        <BearScene />
      </section>

      <section
        aria-label="Today's inspiration"
        className="fade-in-d2 w-full max-w-lg relative z-20"
      >
        <QuoteCard quote={DAILY_QUOTE} date={today} />
      </section>

      <p className="fade-in-d3 font-sans text-forest text-sm mt-5 mb-7 text-center max-w-xs leading-relaxed">
        Each morning, a quiet thought from the woodland —{' '}
        <span className="text-moss">delivered to you.</span>
      </p>

      <section
        aria-label="Sign up for daily inspirations"
        className="fade-in-d4 w-full max-w-sm"
      >
        <SignupForm />
      </section>

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
