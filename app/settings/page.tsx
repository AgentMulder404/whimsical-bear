import BackgroundDecor from '@/components/BackgroundDecor'
import DeliverySettings from '@/components/DeliverySettings'

export const metadata = {
  title: 'Your Delivery Rhythm — Whimsical Bear',
  description: 'Choose when and how your daily woodland moment arrives.',
}

export default function SettingsPage() {
  return (
    <main className="page-bg relative min-h-screen overflow-x-hidden flex flex-col items-center px-5 pt-12 pb-16">

      <BackgroundDecor />

      <header className="fade-in text-center mb-8">
        <h1 className="font-serif text-deep-brown text-xl sm:text-2xl tracking-wide">
          Whimsical Bear
        </h1>
        <p className="font-sans text-coffee/50 text-xs tracking-widest uppercase mt-1">
          Your Delivery Rhythm
        </p>
      </header>

      <section
        aria-label="Delivery preferences"
        className="fade-in-d1 w-full max-w-lg relative z-20"
      >
        <DeliverySettings />
      </section>

    </main>
  )
}
