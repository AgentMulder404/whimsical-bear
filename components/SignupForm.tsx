'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type Mode = 'signup' | 'signin'

export default function SignupForm() {
  const [mode,          setMode]         = useState<Mode>('signup')
  const [email,         setEmail]        = useState('')
  const [phone,         setPhone]        = useState('')
  const [preferredTime, setPreferredTime] = useState('morning')
  const [pendingEmail,  setPendingEmail] = useState('')
  const [submitted,     setSubmitted]    = useState(false)
  const [loading,       setLoading]      = useState(false)
  const [resending,     setResending]    = useState(false)
  const [resent,        setResent]       = useState(false)
  const [errorMsg,      setErrorMsg]     = useState('')

  const switchMode = (next: Mode) => {
    setMode(next)
    setErrorMsg('')
    setSubmitted(false)
    setResent(false)
  }

  // ── Sign up ──────────────────────────────────────────────────────────────────
  const handleSignup = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const res = await fetch('/api/signup', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, phone, preferred_time: preferredTime }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something stirred in the woodland — please try again.')
        return
      }
      setPendingEmail(email)
      setSubmitted(true)
    } catch {
      setErrorMsg('The forest is quiet right now — please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Sign in (magic link) ─────────────────────────────────────────────────────
  const handleSignin = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
          shouldCreateUser: false,   // don't silently create new accounts
        },
      })

      if (error) {
        // Supabase returns a generic error for unrecognised emails to prevent enumeration.
        // We surface a gentle woodland message regardless.
        setErrorMsg('No path was found for that address — have you signed up yet?')
        return
      }

      setPendingEmail(email)
      setSubmitted(true)
    } catch {
      setErrorMsg('The forest is quiet right now — please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Resend ───────────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (!pendingEmail || resending) return
    setResending(true)
    setResent(false)
    try {
      if (mode === 'signup') {
        await supabase.auth.resend({ type: 'signup', email: pendingEmail })
      } else {
        await supabase.auth.signInWithOtp({
          email: pendingEmail,
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
            shouldCreateUser: false,
          },
        })
      }
      setResent(true)
    } finally {
      setResending(false)
    }
  }

  // ── Check inbox state ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="text-center py-8 px-4 fade-in">
        <div className="flex justify-center mb-5" aria-hidden="true">
          <EnvelopeGlyph />
        </div>
        <p className="font-serif text-deep-brown text-xl mb-3">
          {mode === 'signup' ? 'A small bird is on its way.' : 'Your path awaits.'}
        </p>
        <p className="font-sans text-coffee text-sm leading-relaxed max-w-xs mx-auto mb-6">
          {mode === 'signup'
            ? 'It has flown through the trees carrying your confirmation. Check your inbox and click the link to step into the clearing.'
            : 'A sign-in link has been sent to your inbox. Click it to return to the burrow.'
          }
        </p>
        <p className="font-sans text-xs text-coffee">
          {resent
            ? 'The bird has turned back — another message is on its way.'
            : <>
                Didn&rsquo;t receive it?{' '}
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="underline text-moss hover:text-forest transition-colors disabled:opacity-50"
                >
                  {resending ? 'Sending\u2026' : 'Send it again'}
                </button>
                {' '}or check your spam.
              </>
          }
        </p>
      </div>
    )
  }

  // ── Sign-in form ─────────────────────────────────────────────────────────────
  if (mode === 'signin') {
    return (
      <div className="flex flex-col gap-4 w-full fade-in">
        <form onSubmit={handleSignin} className="flex flex-col gap-4" noValidate>

          <div className="group flex flex-col gap-1.5">
            <label
              htmlFor="signin-email"
              className="flex items-center gap-1.5 font-sans text-xs text-coffee group-focus-within:text-moss transition-colors duration-200"
            >
              <SmallLeaf />
              Your email address
            </label>
            <input
              id="signin-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoComplete="email"
              className="
                w-full rounded-2xl
                bg-parchment/60 border border-golden/38
                px-5 py-3.5
                font-sans text-sm text-coffee
                placeholder:text-coffee/35
                focus:ring-2 focus:ring-moss/38 focus:border-moss/48
                transition-all duration-200
              "
            />
          </div>

          {errorMsg && (
            <p role="alert" className="font-sans text-xs text-rust/80 text-center leading-relaxed px-2">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="
              btn-cta
              mt-1 w-full rounded-2xl
              bg-forest text-offwhite
              font-sans font-semibold text-sm
              px-5 py-3.5
              shadow-[0_2px_14px_rgba(53,94,59,0.20)]
              hover:bg-moss hover:shadow-[0_4px_22px_rgba(53,94,59,0.28)]
              active:scale-[0.98]
              focus:ring-2 focus:ring-moss/40
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 ease-in-out
            "
          >
            {loading ? 'Sending your link\u2026' : 'Send me a sign-in link'}
          </button>
        </form>

        <p className="text-center font-sans text-xs text-coffee mt-1">
          New to the woodland?{' '}
          <button
            onClick={() => switchMode('signup')}
            className="underline text-moss hover:text-forest transition-colors"
          >
            Create an account
          </button>
        </p>
      </div>
    )
  }

  // ── Sign-up form ─────────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={handleSignup}
      className="flex flex-col gap-4 w-full"
      noValidate
      aria-label="Sign up for daily inspirations"
    >
      {/* Email input */}
      <div className="group flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="flex items-center gap-1.5 font-sans text-xs text-coffee group-focus-within:text-moss transition-colors duration-200"
        >
          <SmallLeaf />
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          autoComplete="email"
          className="
            w-full rounded-2xl
            bg-parchment/60 border border-golden/38
            px-5 py-3.5
            font-sans text-sm text-coffee
            placeholder:text-coffee/35
            focus:ring-2 focus:ring-moss/38 focus:border-moss/48
            transition-all duration-200
          "
        />
      </div>

      {/* Phone input */}
      <div className="group flex flex-col gap-1.5">
        <label
          htmlFor="phone"
          className="flex items-center gap-1.5 font-sans text-xs text-coffee group-focus-within:text-moss transition-colors duration-200"
        >
          <SmallLeaf />
          Phone number
          <span className="text-coffee/35 font-normal">(optional)</span>
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="+1 (555) 000-0000"
          autoComplete="tel"
          className="
            w-full rounded-2xl
            bg-parchment/60 border border-golden/38
            px-5 py-3.5
            font-sans text-sm text-coffee
            placeholder:text-coffee/35
            focus:ring-2 focus:ring-moss/38 focus:border-moss/48
            transition-all duration-200
          "
        />
      </div>

      {/* Preferred time select */}
      <div className="group flex flex-col gap-1.5">
        <label
          htmlFor="preferred-time"
          className="flex items-center gap-1.5 font-sans text-xs text-coffee group-focus-within:text-moss transition-colors duration-200"
        >
          <SmallLeaf />
          When should your calm arrive?
        </label>
        <select
          id="preferred-time"
          value={preferredTime}
          onChange={e => setPreferredTime(e.target.value)}
          className="
            w-full rounded-2xl
            bg-parchment/60 border border-golden/38
            px-5 py-3.5
            font-sans text-sm text-coffee
            focus:ring-2 focus:ring-moss/38 focus:border-moss/48
            transition-all duration-200
            appearance-none cursor-pointer
          "
        >
          <option value="dawn">Dawn &mdash; 6 AM</option>
          <option value="morning">Morning &mdash; 9 AM</option>
          <option value="midday">Midday &mdash; 12 PM</option>
          <option value="dusk">Dusk &mdash; 6 PM</option>
        </select>
      </div>

      {errorMsg && (
        <p role="alert" className="font-sans text-xs text-rust/80 text-center leading-relaxed px-2">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !email}
        className="
          btn-cta
          mt-1 w-full rounded-2xl
          bg-deep-brown text-offwhite
          font-sans font-semibold text-sm
          px-5 py-3.5
          shadow-[0_2px_14px_rgba(123,63,0,0.20)]
          hover:bg-coffee hover:shadow-[0_4px_22px_rgba(123,63,0,0.28)]
          active:scale-[0.98]
          focus:ring-2 focus:ring-moss/40
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200 ease-in-out
        "
      >
        {loading ? 'Finding your path\u2026' : 'Wake me gently each morning'}
      </button>

      <p className="text-center font-sans text-xs text-coffee mt-0.5">
        No noise. Just a quiet thought at dawn.
      </p>

      {/* ── Sign-in toggle ─────────────────────────────────────────────────── */}
      <p className="text-center font-sans text-xs text-coffee/70 border-t border-golden/25 pt-4 mt-1">
        Already a wanderer?{' '}
        <button
          type="button"
          onClick={() => switchMode('signin')}
          className="underline text-moss hover:text-forest transition-colors"
        >
          Sign in to your burrow
        </button>
      </p>
    </form>
  )
}

// ── Envelope glyph ────────────────────────────────────────────────────────────
function EnvelopeGlyph() {
  return (
    <svg width="64" height="52" viewBox="0 0 64 52" fill="none">
      <rect x="2" y="10" width="60" height="40" rx="6" fill="#E9DCC9" stroke="#E5AA70" strokeWidth="1.5"/>
      <path d="M 2 10 L 32 30 L 62 10" stroke="#E5AA70" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      <circle cx="32" cy="28" r="5" fill="#CC7722" opacity="0.72"/>
      <circle cx="32" cy="28" r="2.5" fill="#954535" opacity="0.55"/>
      <circle cx="57" cy="7"  r="4"   fill="#E5AA70"/>
      <path d="M 60 6 L 65 4 L 64 8 Z" fill="#CC7722" opacity="0.88"/>
      <circle cx="59" cy="5.5" r="1"  fill="#2e1600" opacity="0.82"/>
      <path d="M 53 8 C 55 5 58 6 60 8" stroke="#CC7722" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.60"/>
    </svg>
  )
}

// ── Tiny leaf bullet ──────────────────────────────────────────────────────────
function SmallLeaf() {
  return (
    <svg width="8" height="11" viewBox="0 0 8 11" fill="none" aria-hidden="true">
      <path
        d="M4 10.5C4 10.5 0 7 0 4.5C0 2 1.8 0 4 0C6.2 0 8 2 8 4.5C8 7 4 10.5 4 10.5Z"
        fill="#40826D" opacity="0.60"
      />
      <line x1="4" y1="10.5" x2="4" y2="5" stroke="#FAF9F6" strokeWidth="0.8" />
    </svg>
  )
}
