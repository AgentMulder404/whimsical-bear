'use client'

// ── AuthCallbackClient ─────────────────────────────────────────────────────────
// Receives the PKCE code from the email confirmation link, exchanges it for a
// real session via the Supabase JS client (which persists it to localStorage),
// then navigates to /settings so the user lands logged-in.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { useRouter }           from 'next/navigation'
import { supabase }            from '@/lib/supabase'

interface Props {
  code?:             string
  error?:            string
  errorDescription?: string
}

export default function AuthCallbackClient({ code, error, errorDescription }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'error'>('loading')
  const [message, setMessage] = useState('The forest is welcoming you\u2026')

  useEffect(() => {
    if (error) {
      setStatus('error')
      setMessage(errorDescription ?? 'Something stirred in the woodland — please try again.')
      return
    }

    if (!code) {
      // No code — maybe they navigated here directly. Send them to settings anyway.
      router.replace('/settings')
      return
    }

    supabase.auth
      .exchangeCodeForSession(code)
      .then(({ error: exchangeError }) => {
        if (exchangeError) {
          console.error('[auth:callback]', exchangeError.message)
          setStatus('error')
          setMessage('The confirmation link may have expired — please sign up again.')
          return
        }
        // Session is now stored in localStorage — onAuthStateChange in
        // DeliverySettings will pick it up automatically on arrival.
        router.replace('/settings')
      })
  }, [code, error, errorDescription, router])

  return (
    <main className="page-bg min-h-screen flex flex-col items-center justify-center px-5">
      {status === 'loading' ? (
        <div className="text-center fade-in">
          {/* Animated leaf */}
          <div className="flex justify-center mb-6" aria-hidden="true">
            <svg
              width="40" height="52" viewBox="0 0 40 52" fill="none"
              className="animate-sway"
              style={{ transformOrigin: 'bottom center' }}
            >
              <path
                d="M20 50C20 50 0 34 0 20C0 9 9 0 20 0C31 0 40 9 40 20C40 34 20 50 20 50Z"
                fill="#355E3B" opacity="0.75"
              />
              <line x1="20" y1="50" x2="20" y2="20" stroke="#FAF9F6" strokeWidth="1.5" />
            </svg>
          </div>
          <p className="font-serif text-deep-brown text-xl mb-2">{message}</p>
          <p className="font-sans text-coffee text-sm">
            Almost there — the clearing is just ahead.
          </p>
        </div>
      ) : (
        <div className="text-center fade-in">
          <p className="font-serif text-rust text-xl mb-3">The path was unclear.</p>
          <p className="font-sans text-coffee text-sm leading-relaxed max-w-xs mx-auto mb-6">
            {message}
          </p>
          <a
            href="/"
            className="
              font-sans text-sm text-forest underline
              hover:text-moss transition-colors
            "
          >
            Return to the woodland
          </a>
        </div>
      )}
    </main>
  )
}
