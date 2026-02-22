'use client'

// ── BackgroundMusic ────────────────────────────────────────────────────────────
// A subtle ambient music toggle. No autoplay — user must opt in.
// Fades in over 4s to volume 0.3, fades out before stopping.
// Uses a module-level Audio singleton so the song never restarts
// across Next.js client-side navigations.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'

// ── Singleton audio instance ───────────────────────────────────────────────────
// Declared outside the component so it survives re-renders and page transitions.
let audio: HTMLAudioElement | null = null

// Cancel token for any in-progress fade
let cancelFade: (() => void) | null = null

function fade(
  target:     number,
  durationMs: number,
  onComplete?: () => void,
) {
  cancelFade?.()

  if (!audio) return

  const startVolume = audio.volume
  const startTime   = performance.now()
  let   rafId:    number
  let   cancelled = false

  cancelFade = () => {
    cancelled = true
    cancelAnimationFrame(rafId)
    cancelFade = null
  }

  function tick(now: number) {
    if (cancelled || !audio) return
    const progress  = Math.min((now - startTime) / durationMs, 1)
    audio.volume    = startVolume + (target - startVolume) * progress
    if (progress < 1) {
      rafId = requestAnimationFrame(tick)
    } else {
      cancelFade = null
      onComplete?.()
    }
  }

  rafId = requestAnimationFrame(tick)
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BackgroundMusic() {
  const [playing, setPlaying] = useState(false)
  const initRef = useRef(false)

  useEffect(() => {
    // Create singleton once — safe in strict mode double-invoke because of guard
    if (!initRef.current) {
      initRef.current = true
      if (!audio) {
        audio        = new Audio('/audio/woodland-ambience.m4a')
        audio.loop   = true
        audio.volume = 0
      }
    }

    // Sync button state if audio is already playing (re-mount after navigation)
    if (audio && !audio.paused) setPlaying(true)
  }, [])

  function toggle() {
    if (!audio) return

    if (playing) {
      // Fade out then pause
      fade(0, 2000, () => {
        audio?.pause()
      })
      setPlaying(false)
    } else {
      // Start from silence, fade in over 4s to 0.3
      audio.volume = 0
      audio.play().catch(() => {/* browser may block until interaction */})
      fade(0.3, 4000)
      setPlaying(true)
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={playing ? 'Hush the woods' : 'Listen to the woods'}
      aria-pressed={playing}
      className="
        group flex items-center gap-2
        px-4 py-2 rounded-full
        border border-[#6F4E37]
        bg-[#E9DCC9] text-[#7B3F00]
        font-sans text-xs tracking-wide
        shadow-sm
        hover:bg-[#e0d0b8] hover:shadow-md
        active:scale-[0.97]
        transition-all duration-200 ease-in-out
        select-none
      "
    >
      {/* Leaf icon — animates gently when playing */}
      <LeafIcon playing={playing} />
      <span>{playing ? 'Hush the Woods' : 'Listen to the Woods'}</span>
    </button>
  )
}

// ── Leaf icon ─────────────────────────────────────────────────────────────────

function LeafIcon({ playing }: { playing: boolean }) {
  return (
    <svg
      width="13"
      height="17"
      viewBox="0 0 13 17"
      fill="none"
      aria-hidden="true"
      className={playing ? 'animate-sway' : ''}
      style={{ transformOrigin: 'bottom center' }}
    >
      <path
        d="M6.5 16C6.5 16 0.5 10.5 0.5 6.5C0.5 3.0 3.2 0.5 6.5 0.5C9.8 0.5 12.5 3.0 12.5 6.5C12.5 10.5 6.5 16 6.5 16Z"
        fill="#7B3F00"
        opacity={playing ? '0.85' : '0.55'}
        className="transition-opacity duration-500"
      />
      <line x1="6.5" y1="16" x2="6.5" y2="6" stroke="#E9DCC9" strokeWidth="1" />
    </svg>
  )
}
