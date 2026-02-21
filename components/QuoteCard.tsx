// Future: `quote` and `date` will come from a server-side Quote API fetch
// in app/page.tsx and be passed down as props.

interface QuoteCardProps {
  quote: string
  date?: string
}

export default function QuoteCard({ quote, date }: QuoteCardProps) {
  return (
    <figure
      className="
        relative
        bg-parchment/65 backdrop-blur-sm
        border border-golden/30
        rounded-3xl
        px-8 pt-12 pb-8
        shadow-[0_6px_40px_rgba(123,63,0,0.09),_0_1px_4px_rgba(123,63,0,0.06)]
        w-full text-center
      "
    >
      {/* Corner acorn — top left */}
      <div className="absolute top-4 left-5 opacity-40" aria-hidden="true">
        <AcornIcon />
      </div>

      {/* Corner acorn — top right (mirrored) */}
      <div className="absolute top-4 right-5 opacity-40 scale-x-[-1]" aria-hidden="true">
        <AcornIcon />
      </div>

      {/* Decorative opening quotation mark */}
      <span
        className="
          absolute top-5 left-1/2 -translate-x-1/2
          font-serif text-7xl leading-none
          text-golden/28
          select-none pointer-events-none
        "
        aria-hidden="true"
      >
        &ldquo;
      </span>

      {/* Quote text */}
      <blockquote
        className="
          font-serif italic
          text-xl sm:text-2xl
          text-deep-brown
          leading-[1.75] tracking-wide
          px-2 pt-5 pb-5
          relative z-10
        "
      >
        {quote}
      </blockquote>

      {/* Three-leaf divider */}
      <div
        className="flex items-center justify-center gap-2.5 mb-4"
        aria-hidden="true"
      >
        <div className="h-px w-10 bg-golden/40 rounded-full" />
        <LeafIcon size={10} opacity={0.38} />
        <LeafIcon size={13} opacity={0.55} />
        <LeafIcon size={10} opacity={0.38} />
        <div className="h-px w-10 bg-golden/40 rounded-full" />
      </div>

      {/* Date label */}
      {date && (
        <figcaption className="font-sans text-xs text-coffee/42 tracking-widest uppercase">
          {date}
        </figcaption>
      )}
    </figure>
  )
}

// ── Acorn corner decoration ───────────────────────────────────────────────────
function AcornIcon() {
  return (
    <svg width="22" height="30" viewBox="0 0 22 30" fill="none" aria-hidden="true">
      {/* Cap */}
      <ellipse cx="11" cy="10" rx="10" ry="7" fill="#6F4E37" />
      {/* Cap texture lines */}
      <path d="M 4 8 C 7 6 15 6 18 8"  stroke="#7B3F00" strokeWidth="1"   fill="none" opacity="0.5" />
      <path d="M 3 11 C 7 9 15 9 19 11" stroke="#7B3F00" strokeWidth="0.8" fill="none" opacity="0.4" />
      {/* Body */}
      <ellipse cx="11" cy="20" rx="8" ry="10" fill="#CC7722" />
      {/* Stem */}
      <line x1="11" y1="3" x2="9" y2="0" stroke="#355E3B" strokeWidth="1.5" strokeLinecap="round" />
      {/* Small leaf on stem */}
      <ellipse cx="7.5" cy="1" rx="4" ry="2.5" fill="#355E3B" opacity="0.8" transform="rotate(-35 7.5 1)" />
    </svg>
  )
}

// ── Leaf divider ──────────────────────────────────────────────────────────────
function LeafIcon({ size = 12, opacity = 0.52 }: { size?: number; opacity?: number }) {
  const h = Math.round(size * 1.5)
  return (
    <svg width={size} height={h} viewBox="0 0 12 18" fill="none" aria-hidden="true">
      <path
        d="M6 17C6 17 0 11.5 0 7C0 3.13 2.69 0 6 0C9.31 0 12 3.13 12 7C12 11.5 6 17 6 17Z"
        fill="#40826D"
        opacity={opacity}
      />
      <line x1="6" y1="17" x2="6" y2="6" stroke="#FAF9F6" strokeWidth="0.9" />
    </svg>
  )
}
