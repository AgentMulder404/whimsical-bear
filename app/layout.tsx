import type { Metadata } from 'next'
import { Lora, Nunito } from 'next/font/google'
import BackgroundMusic from '@/components/BackgroundMusic'
import './globals.css'

// ─── Fonts ────────────────────────────────────────────────────────────────────
// Lora: literary, slightly romantic serif — used for the quote and headings
// Nunito: rounded, friendly sans — used for body text, labels, and UI
const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
  display: 'swap',
})

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-nunito',
  display: 'swap',
})

// ─── Metadata ─────────────────────────────────────────────────────────────────
// Future: extend with Open Graph image (AI-generated bear illustration)
// and per-page dynamic metadata from the Quote API.
export const metadata: Metadata = {
  title: 'Whimsical Bear — A daily moment of calm',
  description:
    'Each morning, a quiet thought from the woodland — delivered gently to you.',
  metadataBase: new URL('https://whimsicalbear.com'), // Future: update to live domain
  openGraph: {
    title: 'Whimsical Bear',
    description: 'A daily moment of calm from the woodland.',
    // Future: og:image will be today's AI-generated bear illustration
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${nunito.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
        {/* Persists across all page navigations — fixed to bottom-right */}
        <div className="fixed bottom-5 right-5 z-50">
          <BackgroundMusic />
        </div>
      </body>
    </html>
  )
}
