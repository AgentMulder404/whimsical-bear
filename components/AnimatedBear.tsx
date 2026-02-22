'use client'

// ── AnimatedBear ───────────────────────────────────────────────────────────────
//
// Decorative background bear — right side of the screen, behind all UI.
// Plays a one-shot sequence on mount:
//   1. Fades in (sitting)  →  2. Slowly rises  →  3. Turns toward viewer
//   4. Breathes gently in a subtle loop forever after
//
// ── Swapping in a video / 3D asset ────────────────────────────────────────────
// When you have a transparent-background WebM or a GLTF/Three.js canvas,
// replace the <Image> block with:
//
//   <video
//     src="/bear-animated.webm"
//     autoPlay muted loop playsInline
//     className="w-full h-auto object-contain"
//   />
//
// The Framer Motion wrapper and positioning stay identical.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef }       from 'react'
import { motion, useAnimation }    from 'framer-motion'
import Image                       from 'next/image'

// ── Animation timing ──────────────────────────────────────────────────────────
const EASE_OUT_SOFT  = [0.25, 0.46, 0.45, 0.94] as const
const EASE_SPRING    = [0.34, 1.20, 0.64, 1.00] as const

export default function AnimatedBear() {
  const controls   = useAnimation()
  const cancelRef  = useRef(false)

  useEffect(() => {
    cancelRef.current = false

    async function playSequence() {

      // ── Phase 1: Fade in — bear sitting, deep in the forest ─────────────────
      await controls.start({
        opacity:   1,
        y:         0,
        scale:     1,
        transition: { duration: 1.8, ease: EASE_OUT_SOFT },
      })

      if (cancelRef.current) return
      await sleep(900)   // hold sitting pose — unhurried

      // ── Phase 2: Bear rises — slow, weighted, deliberate ────────────────────
      if (cancelRef.current) return
      await controls.start({
        y:      -32,
        scaleX: 0.95,
        scaleY: 1.08,
        transition: { duration: 2.6, ease: EASE_SPRING },
      })

      // ── Phase 3: Turns gently toward the viewer ──────────────────────────────
      if (cancelRef.current) return
      await controls.start({
        rotateY: -6,
        y:       -26,
        scaleX:  0.97,
        scaleY:  1.06,
        transition: { duration: 1.8, ease: EASE_OUT_SOFT },
      })

      // ── Phase 4: Subtle breathing loop — alive but still ─────────────────────
      if (cancelRef.current) return
      controls.start({
        y:      [-26, -30, -26],
        scaleY: [1.06, 1.08, 1.06],
        transition: {
          duration:  5.5,
          repeat:    Infinity,
          ease:      'easeInOut',
          times:     [0, 0.5, 1],
        },
      })
    }

    playSequence()

    return () => { cancelRef.current = true }
  }, [controls])

  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none select-none
        absolute bottom-0 right-0 z-[8]
        w-36 sm:w-56 md:w-72 lg:w-[22rem] xl:w-[26rem]
      "
    >
      <motion.div
        initial={{ opacity: 0, y: 56, scale: 0.96 }}
        animate={controls}
        style={{
          transformPerspective: 900,
          transformOrigin:      'bottom center',
        }}
        className="relative"
      >
        {/* ── Depth-of-field blur ── keeps the bear "deeper" in the forest ──── */}
        <div
          className="relative"
          style={{ filter: 'blur(1.4px)' }}
        >
          {/* Warm golden rim-light overlay */}
          <div
            aria-hidden="true"
            className="
              absolute inset-0 z-10 pointer-events-none rounded-2xl
              bg-gradient-to-tr from-golden/28 via-ochre/10 to-transparent
            "
            style={{ mixBlendMode: 'multiply' }}
          />

          {/* Bear portrait */}
          <Image
            src="/bear-portrait.png"
            alt=""
            width={932}
            height={860}
            className="w-full h-auto object-contain rounded-2xl"
            sizes="
              (max-width: 640px)  144px,
              (max-width: 768px)  224px,
              (max-width: 1024px) 288px,
              416px
            "
            priority={false}
          />
        </div>

        {/* Ground shadow — roots the bear to the floor */}
        <div
          aria-hidden="true"
          className="
            absolute -bottom-3 left-[8%] right-[8%] h-8
            bg-deep-brown/14 rounded-full
          "
          style={{ filter: 'blur(14px)' }}
        />
      </motion.div>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}
