'use client'

import { useState } from 'react'

export default function DuckEasterEgg() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">

      {/* ── Speech bubble ────────────────────────────────────────────────────
           Pops in above the duck's head on click. Tail points down-left
           toward the duck's bill area.
      ────────────────────────────────────────────────────────────────────── */}
      <div
        aria-live="polite"
        className={`
          absolute bottom-[108%] left-3 z-20 origin-bottom-left
          transition-all duration-300 ease-out
          ${open
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-75 translate-y-2 pointer-events-none'}
        `}
      >
        {/* Bubble body */}
        <div className="
          bg-white border border-golden/50 rounded-2xl
          px-4 py-2.5 whitespace-nowrap
          shadow-[0_4px_20px_rgba(123,63,0,0.22)]
        ">
          <p className="font-serif text-deep-brown text-sm tracking-wide">
            Happy Birthday!!
          </p>
        </div>

        {/* Bubble tail — rotated square pointing down-left */}
        <div className="
          absolute -bottom-[7px] left-5 w-3.5 h-3.5
          bg-white border-r border-b border-golden/50
          rotate-45
        "/>
      </div>

      {/* ── Duck — click to toggle bubble ────────────────────────────────── */}
      <button
        onClick={() => setOpen(prev => !prev)}
        aria-label="A hidden easter egg duck — click me!"
        aria-expanded={open}
        className="cursor-pointer focus-visible:ring-2 focus-visible:ring-golden/60 rounded-full"
      >
        <div className="animate-sway">
          <WoodlandDuck />
        </div>
      </button>

    </div>
  )
}

/* ── Whimsical duck SVG ───────────────────────────────────────────────────────
   Extracted here from BackgroundDecor so this client component owns it.
   ──────────────────────────────────────────────────────────────────────────── */
function WoodlandDuck() {
  return (
    <svg
      viewBox="0 0 90 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      {/* ── Mushroom hat ── */}
      <rect    x="56"  y="28"  width="10" height="14" rx="3"   fill="#E9DCC9"/>
      <ellipse cx="61" cy="28" rx="24"    ry="13"               fill="#954535"/>
      <path d="M 38 29 C 50 34 72 34 84 29" stroke="#7B3F00" strokeWidth="1" fill="none" opacity="0.28"/>
      <circle  cx="54" cy="21" r="2.5"    fill="#FAF9F6" opacity="0.72"/>
      <circle  cx="64" cy="18" r="2"      fill="#FAF9F6" opacity="0.72"/>
      <circle  cx="46" cy="24" r="1.8"    fill="#FAF9F6" opacity="0.65"/>
      <circle  cx="73" cy="22" r="1.5"    fill="#FAF9F6" opacity="0.60"/>

      {/* ── Body ── */}
      <ellipse cx="40" cy="74" rx="33" ry="25"  fill="#E5AA70"/>
      <ellipse cx="35" cy="77" rx="18" ry="13"  fill="#FAF9F6" opacity="0.17"/>

      {/* Tail feather */}
      <path
        d="M 14 66 C 6 56 4 46 10 40 C 14 36 18 42 16 50 C 15 57 14 66 14 66 Z"
        fill="#E5AA70"
      />
      <path d="M 10 40 C 8 36 10 32 13 35" stroke="#CC7722" strokeWidth="1" fill="none" opacity="0.50"/>

      {/* ── Wing feathers ── */}
      <path d="M 18 76 C 28 64 52 60 66 70" stroke="#CC7722" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M 24 74 C 30 65 36 66 38 74" stroke="#CC7722" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M 38 74 C 44 64 50 65 52 73" stroke="#CC7722" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M 52 72 C 58 63 63 64 64 71" stroke="#CC7722" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

      {/* ── Head ── */}
      <circle cx="62" cy="54" r="22" fill="#E5AA70"/>

      {/* ── Bill ── */}
      <path d="M 80 52 C 89 47 93 53 89 58 C 86 63 80 60 80 54 Z" fill="#CC7722"/>
      <path d="M 80 52 C 89 47 93 53 89 56 L 80 54 Z" fill="#954535" opacity="0.38"/>
      <circle cx="86" cy="53" r="1.2" fill="#7B3F00" opacity="0.55"/>

      {/* ── Eye ── */}
      <circle cx="72" cy="48" r="7.5" fill="#E5AA70"/>
      <circle cx="72" cy="48" r="6"   fill="#2e1600" opacity="0.88"/>
      <circle cx="74" cy="46" r="2.5" fill="#FAF9F6" opacity="0.60"/>
      <path d="M 66 44 C 69 40 75 40 78 44" stroke="#2e1600" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.70"/>

      {/* Cheek blush */}
      <ellipse cx="70" cy="58" rx="7" ry="5" fill="#954535" opacity="0.11"/>

      {/* ── Legs and feet ── */}
      <line x1="36" y1="95"  x2="34" y2="104" stroke="#CC7722" strokeWidth="3" strokeLinecap="round"/>
      <line x1="52" y1="97"  x2="52" y2="106" stroke="#CC7722" strokeWidth="3" strokeLinecap="round"/>
      <path d="M 28 104 C 32 109 38 109 40 104" fill="#CC7722" opacity="0.80"/>
      <path d="M 46 106 C 50 111 56 111 58 106" fill="#CC7722" opacity="0.80"/>
      <line x1="34" y1="104" x2="28" y2="108" stroke="#CC7722" strokeWidth="1.5" strokeLinecap="round" opacity="0.70"/>
      <line x1="34" y1="104" x2="34" y2="109" stroke="#CC7722" strokeWidth="1.5" strokeLinecap="round" opacity="0.70"/>
      <line x1="34" y1="104" x2="40" y2="108" stroke="#CC7722" strokeWidth="1.5" strokeLinecap="round" opacity="0.70"/>
      <line x1="52" y1="106" x2="46" y2="110" stroke="#CC7722" strokeWidth="1.5" strokeLinecap="round" opacity="0.70"/>
      <line x1="52" y1="106" x2="52" y2="111" stroke="#CC7722" strokeWidth="1.5" strokeLinecap="round" opacity="0.70"/>
      <line x1="52" y1="106" x2="58" y2="110" stroke="#CC7722" strokeWidth="1.5" strokeLinecap="round" opacity="0.70"/>

      {/* Acorn at feet */}
      <ellipse cx="72" cy="105" rx="5"   ry="6.5" fill="#CC7722" opacity="0.70"/>
      <ellipse cx="72" cy="99"  rx="5.5" ry="3"   fill="#6F4E37" opacity="0.78"/>
      <line    x1="72" y1="96"  x2="70"  y2="92"  stroke="#355E3B" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
