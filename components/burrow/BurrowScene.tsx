'use client'

import { useState, useEffect } from 'react'
import { useRouter }           from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import type { User }           from '@supabase/supabase-js'
import { supabase }            from '@/lib/supabase'
import DeliverySettings        from '@/components/DeliverySettings'

// ── Types ─────────────────────────────────────────────────────────────────────

type Hotspot = 'window' | 'mailbox' | 'bookshelf' | null

interface Moment { id: string; date: string; quote: string }

// ── Component ─────────────────────────────────────────────────────────────────

export default function BurrowScene({ user }: { user: User }) {
  const router                          = useRouter()
  const [open,        setOpen]          = useState<Hotspot>(null)
  const [hover,       setHover]         = useState<Hotspot>(null)
  const [todayQuote,  setTodayQuote]    = useState('')
  const [todayDate,   setTodayDate]     = useState('')
  const [archive,     setArchive]       = useState<Moment[]>([])
  const [archiveLoad, setArchiveLoad]   = useState(false)

  // ── Fetch today's quote ───────────────────────────────────────────────────
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    supabase
      .from('daily_moments')
      .select('quote, date')
      .eq('date', today)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setTodayQuote(data.quote)
          setTodayDate(new Date(data.date + 'T00:00:00Z').toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC',
          }))
        }
      })
  }, [])

  // ── Fetch archive when bookshelf opens ────────────────────────────────────
  useEffect(() => {
    if (open !== 'bookshelf' || archive.length > 0) return
    setArchiveLoad(true)
    supabase
      .from('daily_moments')
      .select('id, date, quote')
      .order('date', { ascending: false })
      .limit(30)
      .then(({ data }) => {
        if (data) setArchive(data)
        setArchiveLoad(false)
      })
  }, [open, archive.length])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  // ── Glow class for each hotspot ───────────────────────────────────────────
  const glow = (spot: Hotspot) =>
    hover === spot || open === spot ? 'opacity-100' : 'opacity-0'

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex flex-col"
         style={{ background: '#130c06' }}>

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="relative z-30 flex items-center justify-between px-6 pt-5 pb-2">
        <p className="font-serif text-[#E5AA70] text-sm tracking-wide opacity-80">
          Whimsical Bear &mdash; The Burrow
        </p>
        <button
          onClick={handleSignOut}
          className="font-sans text-xs text-[#E9DCC9]/50 hover:text-[#E9DCC9]/80 transition-colors"
        >
          Leave the den
        </button>
      </div>

      {/* ── Scene ───────────────────────────────────────────────────────────── */}
      <div className="relative flex-1 flex items-center justify-center px-4 pb-8">
        <div className="relative w-full max-w-3xl">
          <svg
            viewBox="0 0 760 520"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            aria-label="The Burrow — a cozy bear den"
          >
            <defs>
              {/* Fireplace glow radial */}
              <radialGradient id="fireGlow" cx="50%" cy="90%" r="55%">
                <stop offset="0%"   stopColor="#FF6B00" stopOpacity="0.55"/>
                <stop offset="60%"  stopColor="#CC4400" stopOpacity="0.18"/>
                <stop offset="100%" stopColor="#130c06"  stopOpacity="0"/>
              </radialGradient>
              {/* Window forest light */}
              <radialGradient id="windowGlow" cx="50%" cy="50%" r="55%">
                <stop offset="0%"   stopColor="#7CB87C" stopOpacity="0.45"/>
                <stop offset="100%" stopColor="#130c06"  stopOpacity="0"/>
              </radialGradient>
              {/* Bookshelf candle glow */}
              <radialGradient id="candleGlow" cx="50%" cy="50%" r="70%">
                <stop offset="0%"   stopColor="#E5AA70" stopOpacity="0.50"/>
                <stop offset="100%" stopColor="#130c06"  stopOpacity="0"/>
              </radialGradient>
              {/* Mailbox hover glow */}
              <radialGradient id="mailGlow" cx="50%" cy="50%" r="70%">
                <stop offset="0%"   stopColor="#CC7722" stopOpacity="0.45"/>
                <stop offset="100%" stopColor="#130c06"  stopOpacity="0"/>
              </radialGradient>
              {/* Stone texture filter */}
              <filter id="roughen">
                <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="4" result="noise"/>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G"/>
              </filter>
            </defs>

            {/* ── Cave wall background ────────────────────────────────────── */}
            <rect width="760" height="520" fill="#1e1008"/>
            {/* Stone patches */}
            {[
              "M0 0 L120 0 L110 40 L0 60 Z",
              "M120 0 L280 0 L265 50 L110 40 Z",
              "M280 0 L450 0 L440 55 L265 50 Z",
              "M450 0 L620 0 L610 45 L440 55 Z",
              "M620 0 L760 0 L760 55 L610 45 Z",
              "M0 60 L110 40 L95 110 L0 130 Z",
              "M110 40 L265 50 L250 120 L95 110 Z",
              "M440 55 L610 45 L600 115 L430 125 Z",
              "M610 45 L760 55 L760 130 L600 115 Z",
              "M0 380 L130 365 L140 430 L0 450 Z",
              "M630 370 L760 355 L760 440 L620 445 Z",
            ].map((d, i) => (
              <path key={i} d={d} fill={i % 2 === 0 ? '#2a1508' : '#251205'} filter="url(#roughen)"/>
            ))}

            {/* ── Floor ───────────────────────────────────────────────────── */}
            <rect x="0" y="430" width="760" height="90" fill="#1a0c06"/>
            <rect x="0" y="425" width="760" height="8"  fill="#2d1508" opacity="0.7"/>

            {/* ── Fur rug ─────────────────────────────────────────────────── */}
            <ellipse cx="380" cy="465" rx="195" ry="38" fill="#6B2D0E" opacity="0.75"/>
            <ellipse cx="380" cy="465" rx="170" ry="30" fill="#7B3418" opacity="0.65"/>
            <ellipse cx="380" cy="465" rx="140" ry="22" fill="#8B3D1E" opacity="0.5"/>
            {/* Rug texture lines */}
            {[-60,-30,0,30,60].map(offset => (
              <line key={offset} x1={380+offset} y1="440" x2={380+offset+5} y2="490"
                    stroke="#6B2D0E" strokeWidth="1" opacity="0.3"/>
            ))}

            {/* ── Fireplace glow (ambient) ─────────────────────────────────── */}
            <ellipse cx="380" cy="480" rx="240" ry="120" fill="url(#fireGlow)"/>

            {/* ── Fireplace ───────────────────────────────────────────────── */}
            {/* Stone arch */}
            <path d="M 290 520 L 290 415 Q 380 375 470 415 L 470 520 Z" fill="#2a1508"/>
            <path d="M 300 520 L 300 420 Q 380 385 460 420 L 460 520 Z" fill="#1a0c06"/>
            {/* Mantel */}
            <rect x="278" y="412" width="204" height="14" rx="3" fill="#3D1F0A"/>
            <rect x="272" y="404" width="216" height="12" rx="3" fill="#4A2710"/>
            {/* Ember glow */}
            <ellipse cx="380" cy="500" rx="55" ry="14" fill="#CC4400" opacity="0.55"/>
            <ellipse cx="380" cy="500" rx="35" ry="8"  fill="#FF6B00" opacity="0.70"/>
            <ellipse cx="380" cy="497" rx="18" ry="5"  fill="#FF9500" opacity="0.85"/>
            {/* Ember sparks */}
            {[
              {cx:355,cy:494},{cx:367,cy:491},{cx:380,cy:490},
              {cx:393,cy:492},{cx:405,cy:494},
            ].map((p,i) => (
              <circle key={i} cx={p.cx} cy={p.cy} r="2.5" fill="#FFB700" opacity="0.9"/>
            ))}
            {/* Log */}
            <rect x="340" y="500" width="80" height="12" rx="6" fill="#3D1F0A" opacity="0.9"/>
            <rect x="355" y="500" width="50" height="10" rx="5" fill="#4A2710"/>

            {/* ── Honey jars & baskets (right) ────────────────────────────── */}
            {/* Small shelf */}
            <rect x="575" y="340" width="135" height="8"  rx="3" fill="#3D1F0A"/>
            <rect x="580" y="348" width="4"   height="50" rx="2" fill="#4A2710"/>
            <rect x="706" y="348" width="4"   height="50" rx="2" fill="#4A2710"/>
            {/* Jar 1 (large honey) */}
            <ellipse cx="620" cy="340" rx="20" ry="6"  fill="#5C3010"/>
            <rect    x="600"  y="305" width="40" height="36" rx="10" fill="#CC7722" opacity="0.88"/>
            <rect    x="604"  y="310" width="32" height="20" rx="6"  fill="#E5AA70" opacity="0.55"/>
            <ellipse cx="620" cy="305" rx="17" ry="5"  fill="#E5AA70" opacity="0.75"/>
            <rect    x="613"  y="298" width="14" height="8" rx="3"  fill="#5C3010"/>
            {/* Jar 2 (small honey) */}
            <ellipse cx="662" cy="340" rx="14" ry="5"  fill="#5C3010"/>
            <rect    x="648"  y="313" width="28" height="28" rx="8"  fill="#CC7722" opacity="0.85"/>
            <rect    x="651"  y="317" width="22" height="14" rx="5"  fill="#E5AA70" opacity="0.5"/>
            <ellipse cx="662" cy="313" rx="12" ry="4"  fill="#E5AA70" opacity="0.72"/>
            <rect    x="657"  y="307" width="10" height="7" rx="2"  fill="#5C3010"/>
            {/* Small basket */}
            <ellipse cx="695" cy="345" rx="15" ry="5"  fill="#5C3010"/>
            <path d="M 680 310 Q 695 295 710 310 L 710 345 L 680 345 Z" fill="#7B4A18" opacity="0.75"/>
            {[0,4,8,12].map(y => (
              <line key={y} x1="680" y1={316+y} x2="710" y2={316+y}
                    stroke="#5C3010" strokeWidth="0.8" opacity="0.5"/>
            ))}

            {/* ── BOOKSHELF hotspot ────────────────────────────────────────── */}
            {/* Candle glow (behind shelf) */}
            <ellipse cx="155" cy="165" rx="65" ry="55" fill="url(#candleGlow)"
                     className={`transition-opacity duration-500 ${glow('bookshelf')}`}/>
            {/* Shelf frame */}
            <rect x="28" y="75" width="155" height="315" rx="5" fill="#3D1F0A"/>
            <rect x="34" y="80" width="143" height="305" rx="4" fill="#2A1207"/>
            {/* Shelf planks */}
            {[185, 285].map(y => (
              <rect key={y} x="28" y={y} width="155" height="9" rx="2" fill="#3D1F0A"/>
            ))}
            {/* Books — top shelf */}
            {[
              {x:40, w:16, h:90, c:'#355E3B'}, {x:58, w:13, h:82, c:'#7B3F00'},
              {x:73, w:18, h:88, c:'#CC7722'}, {x:93, w:14, h:85, c:'#954535'},
              {x:109,w:11, h:91, c:'#40826D'}, {x:122,w:15, h:80, c:'#8A9AFB'},
              {x:139,w:13, h:86, c:'#5F8575'},
            ].map((b,i) => (
              <rect key={i} x={b.x} y={95} width={b.w} height={b.h} rx="2" fill={b.c} opacity="0.90"/>
            ))}
            {/* Books — middle shelf */}
            {[
              {x:38, w:20, h:85, c:'#7B3F00'}, {x:60, w:12, h:78, c:'#40826D'},
              {x:74, w:17, h:82, c:'#8A9AFB'}, {x:93, w:15, h:88, c:'#CC7722'},
              {x:110,w:13, h:79, c:'#355E3B'}, {x:125,w:18, h:84, c:'#954535'},
            ].map((b,i) => (
              <rect key={i} x={b.x} y={195} width={b.w} height={b.h} rx="2" fill={b.c} opacity="0.88"/>
            ))}
            {/* Books — bottom shelf */}
            {[
              {x:40, w:14, h:80, c:'#5F8575'}, {x:56, w:19, h:86, c:'#7B3F00'},
              {x:77, w:12, h:77, c:'#CC7722'}, {x:91, w:16, h:83, c:'#40826D'},
              {x:109,w:14, h:80, c:'#954535'},
            ].map((b,i) => (
              <rect key={i} x={b.x} y={295} width={b.w} height={b.h} rx="2" fill={b.c} opacity="0.87"/>
            ))}
            {/* Candle on top of shelf */}
            <rect x="148" y="60" width="10" height="18" rx="2" fill="#E9DCC9" opacity="0.85"/>
            <ellipse cx="153" cy="60" rx="5" ry="3" fill="#E5AA70" opacity="0.7"/>
            <path d="M 153 52 Q 150 46 153 40 Q 156 46 153 52" fill="#FF9500" opacity="0.9"/>

            {/* ── WINDOW hotspot ───────────────────────────────────────────── */}
            {/* Forest ambient glow behind */}
            <ellipse cx="460" cy="165" rx="120" ry="100" fill="url(#windowGlow)"
                     className={`transition-opacity duration-500 ${glow('window')}`}/>
            {/* Stone window surround */}
            <path d="M 360 70 Q 460 20 560 70 L 560 230 L 360 230 Z" fill="#2a1508" filter="url(#roughen)"/>
            {/* Wood frame */}
            <path d="M 370 76 Q 460 30 550 76 L 550 222 L 370 222 Z" fill="#4A2710"/>
            {/* Glass (night forest) */}
            <path d="M 380 82 Q 460 40 540 82 L 540 214 L 380 214 Z" fill="#0a1a0a"/>
            {/* Stars */}
            {[
              {cx:410,cy:65},{cx:430,cy:55},{cx:465,cy:52},{cx:495,cy:60},
              {cx:515,cy:70},{cx:420,cy:80},{cx:500,cy:78},{cx:450,cy:62},
            ].map((s,i) => (
              <circle key={i} cx={s.cx} cy={s.cy} r="1.5" fill="#E9DCC9" opacity="0.8"/>
            ))}
            {/* Moon */}
            <circle cx="505" cy="68" r="12" fill="#E9DCC9" opacity="0.20"/>
            <circle cx="509" cy="64" r="12" fill="#0a1a0a"/>
            <circle cx="505" cy="68" r="12" fill="#E9DCC9" opacity="0.18"/>
            {/* Tree silhouettes */}
            <path d="M 390 215 L 390 160 L 380 160 L 405 130 L 382 130 L 408 100 L 385 100 L 412 72"
                  fill="#0f260f" stroke="#162e16" strokeWidth="1"/>
            <path d="M 415 215 L 415 155 L 406 155 L 428 122 L 408 122 L 432 88"
                  fill="#0f260f" stroke="#162e16" strokeWidth="1"/>
            <path d="M 500 215 L 500 160 L 490 160 L 514 128 L 492 128 L 516 96"
                  fill="#0f260f" stroke="#162e16" strokeWidth="1"/>
            <path d="M 530 215 L 530 175 L 521 175 L 540 148 L 522 148 L 542 120"
                  fill="#0f260f" stroke="#162e16" strokeWidth="1"/>
            {/* Forest floor glow */}
            <rect x="380" y="200" width="160" height="14" fill="#1a3a1a" opacity="0.6"/>
            {/* Cross pane */}
            <line x1="460" y1="40"  x2="460" y2="214" stroke="#3D1F0A" strokeWidth="4"/>
            <line x1="380" y1="148" x2="540" y2="148" stroke="#3D1F0A" strokeWidth="4"/>
            {/* Window ledge */}
            <rect x="362" y="218" width="196" height="14" rx="3" fill="#3D1F0A"/>
            {/* Label */}
            <text x="460" y="248" textAnchor="middle"
                  fontFamily="serif" fontSize="11" fill="#E5AA70" opacity="0.60">
              today&apos;s whisper
            </text>

            {/* ── MAILBOX hotspot ──────────────────────────────────────────── */}
            {/* Glow behind */}
            <ellipse cx="640" cy="220" rx="90" ry="70" fill="url(#mailGlow)"
                     className={`transition-opacity duration-500 ${glow('mailbox')}`}/>
            {/* Wall mount */}
            <rect x="634" y="165" width="12" height="90" rx="3" fill="#3D1F0A"/>
            {/* Box body */}
            <rect x="590" y="155" width="100" height="75" rx="8" fill="#4A2710"/>
            <rect x="596" y="161" width="88"  height="63" rx="6" fill="#3D1F0A"/>
            {/* Curved roof */}
            <path d="M 585 158 Q 640 130 695 158 Z" fill="#5C3010"/>
            {/* Door */}
            <rect x="606" y="195" width="68" height="28" rx="5" fill="#2A1207"/>
            {/* Mail slot */}
            <rect x="618" y="207" width="44" height="5"  rx="2" fill="#3D1F0A"/>
            {/* Envelope peeking out */}
            <path d="M 625 195 L 656 195 L 656 207 L 625 207 Z" fill="#E9DCC9" opacity="0.85"/>
            <path d="M 625 195 L 640.5 202 L 656 195" stroke="#CC7722" strokeWidth="1.2" fill="none"/>
            {/* Flag */}
            <line x1="693" y1="135" x2="693" y2="165" stroke="#5C3010" strokeWidth="3"/>
            <rect x="688"  y="135" width="22" height="15" rx="3" fill="#954535" opacity="0.9"/>
            {/* Label */}
            <text x="640" y="248" textAnchor="middle"
                  fontFamily="serif" fontSize="11" fill="#E5AA70" opacity="0.60">
              delivery rhythm
            </text>

          </svg>

          {/* ── Invisible hotspot click areas ────────────────────────────────── */}
          <HotspotButton
            label="Open the bookshelf"
            style={{ left: '2%', top: '12%', width: '22%', height: '66%' }}
            spot="bookshelf"
            hover={hover}
            onHover={setHover}
            onClick={() => setOpen('bookshelf')}
          />
          <HotspotButton
            label="Look through the window"
            style={{ left: '46%', top: '2%', width: '28%', height: '48%' }}
            spot="window"
            hover={hover}
            onHover={setHover}
            onClick={() => setOpen('window')}
          />
          <HotspotButton
            label="Check the mailbox"
            style={{ left: '75%', top: '25%', width: '22%', height: '36%' }}
            spot="mailbox"
            hover={hover}
            onHover={setHover}
            onClick={() => setOpen('mailbox')}
          />
        </div>
      </div>

      {/* ── Modals ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-5"
            style={{ background: 'rgba(19,12,6,0.78)', backdropFilter: 'blur(6px)' }}
            onClick={() => setOpen(null)}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl
                         bg-[#E9DCC9] shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
              onClick={e => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setOpen(null)}
                className="absolute top-4 right-5 font-sans text-xs text-[#6F4E37]/50
                           hover:text-[#6F4E37] transition-colors z-10"
              >
                close ✕
              </button>

              {/* ── Quote modal ────────────────────────────────────────────── */}
              {open === 'window' && (
                <div className="px-10 py-12 text-center">
                  <p className="font-sans text-[10px] text-[#6F4E37]/50 tracking-widest uppercase mb-6">
                    {todayDate || 'Today\'s whisper'}
                  </p>
                  <div className="text-[#E5AA70]/40 font-serif text-7xl leading-none select-none mb-2">
                    &ldquo;
                  </div>
                  <blockquote className="font-serif text-xl sm:text-2xl text-[#7B3F00]
                                         leading-relaxed tracking-wide italic px-2 mb-8">
                    {todayQuote || 'The forest is still writing today\u2019s whisper\u2026'}
                  </blockquote>
                  <div className="flex items-center justify-center gap-2.5">
                    <div className="h-px w-10 bg-[#CC7722]/40 rounded-full"/>
                    <LeafDivider/>
                    <div className="h-px w-10 bg-[#CC7722]/40 rounded-full"/>
                  </div>
                </div>
              )}

              {/* ── Delivery settings modal ────────────────────────────────── */}
              {open === 'mailbox' && (
                <div className="px-6 py-10">
                  <p className="font-serif text-[#7B3F00] text-xl text-center mb-6">
                    Your Delivery Rhythm
                  </p>
                  <DeliverySettings />
                </div>
              )}

              {/* ── Archive modal ──────────────────────────────────────────── */}
              {open === 'bookshelf' && (
                <div className="px-7 py-10">
                  <p className="font-serif text-[#7B3F00] text-xl text-center mb-1">
                    The Bear&rsquo;s Journal
                  </p>
                  <p className="font-sans text-[10px] text-[#6F4E37]/50 tracking-widest
                                uppercase text-center mb-7">
                    Past whispers from the forest
                  </p>
                  {archiveLoad ? (
                    <p className="font-sans text-sm text-[#6F4E37]/60 text-center py-8">
                      Turning the pages\u2026
                    </p>
                  ) : archive.length === 0 ? (
                    <p className="font-sans text-sm text-[#6F4E37]/60 text-center py-8">
                      The journal is still empty — check back tomorrow.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-5">
                      {archive.map(m => (
                        <div key={m.id} className="border-b border-[#CC7722]/20 pb-5 last:border-0 last:pb-0">
                          <p className="font-sans text-[10px] text-[#6F4E37]/50
                                        tracking-widest uppercase mb-2">
                            {new Date(m.date + 'T00:00:00Z').toLocaleDateString('en-US', {
                              weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC',
                            })}
                          </p>
                          <p className="font-serif italic text-[#7B3F00] text-base leading-relaxed">
                            &ldquo;{m.quote}&rdquo;
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Hotspot button ─────────────────────────────────────────────────────────────

function HotspotButton({
  label, style, spot, hover, onHover, onClick,
}: {
  label:   string
  style:   React.CSSProperties
  spot:    Hotspot
  hover:   Hotspot
  onHover: (s: Hotspot) => void
  onClick: () => void
}) {
  const isHovered = hover === spot
  return (
    <button
      aria-label={label}
      onClick={onClick}
      onMouseEnter={() => onHover(spot)}
      onMouseLeave={() => onHover(null)}
      className="absolute rounded-2xl transition-all duration-300 cursor-pointer focus:outline-none"
      style={{
        ...style,
        background: isHovered ? 'rgba(229,170,112,0.08)' : 'transparent',
        boxShadow:  isHovered ? 'inset 0 0 0 1.5px rgba(229,170,112,0.25)' : 'none',
      }}
    />
  )
}

// ── Leaf divider ──────────────────────────────────────────────────────────────

function LeafDivider() {
  return (
    <svg width="13" height="19" viewBox="0 0 12 18" fill="none" aria-hidden="true">
      <path d="M6 17C6 17 0 11.5 0 7C0 3.13 2.69 0 6 0C9.31 0 12 3.13 12 7C12 11.5 6 17 6 17Z"
            fill="#40826D" opacity="0.55"/>
      <line x1="6" y1="17" x2="6" y2="6" stroke="#E9DCC9" strokeWidth="0.9"/>
    </svg>
  )
}
