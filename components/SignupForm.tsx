'use client'

import { useState } from 'react'

// Future: replace handleSubmit body with POST to /api/subscribe.
// Auth integration: check session state before rendering — if already
// subscribed, render notification preferences instead of this form.

export default function SignupForm() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    // Future: await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email, phone }) })
    await new Promise((r) => setTimeout(r, 650))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-8 px-4 fade-in">
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-moss/12 mb-5"
          aria-hidden="true"
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path
              d="M 5 13.5 L 11 19.5 L 21 8"
              stroke="#40826D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="font-serif text-deep-brown text-xl mb-2">
          You&rsquo;re all set.
        </p>
        <p className="font-sans text-coffee/58 text-sm leading-relaxed">
          Your morning calm is on its way.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full"
      noValidate
      aria-label="Sign up for daily inspirations"
    >
      {/* Email input */}
      <div className="group flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="flex items-center gap-1.5 font-sans text-xs text-coffee/55 group-focus-within:text-moss transition-colors duration-200"
        >
          <SmallLeaf />
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          className="flex items-center gap-1.5 font-sans text-xs text-coffee/55 group-focus-within:text-moss transition-colors duration-200"
        >
          <SmallLeaf />
          Phone number
          <span className="text-coffee/35 font-normal">(optional)</span>
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
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

      {/* CTA button — shimmer sweep plays once on hover via .btn-cta */}
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

      <p className="text-center font-sans text-xs text-coffee/35 mt-0.5">
        No noise. Just a quiet thought at dawn.
      </p>
    </form>
  )
}

// ── Tiny leaf bullet used beside input labels ─────────────────────────────────
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
