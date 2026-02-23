'use client'

// ── HomeRouter ─────────────────────────────────────────────────────────────────
// Checks auth on mount and renders The Burrow for signed-in users,
// or the regular landing page for guests.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState }  from 'react'
import type { User }            from '@supabase/supabase-js'
import { supabase }             from '@/lib/supabase'
import BurrowScene              from '@/components/burrow/BurrowScene'
import LandingPage              from '@/components/LandingPage'

export default function HomeRouter() {
  const [user,    setUser]    = useState<User | null | undefined>(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Still resolving — show nothing (avoids flash of wrong content)
  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: '#130c06' }}>
        <div className="animate-sway" aria-hidden="true">
          <svg width="30" height="40" viewBox="0 0 30 40" fill="none">
            <path d="M15 38C15 38 0 26 0 16C0 7 6.7 0 15 0C23.3 0 30 7 30 16C30 26 15 38 15 38Z"
                  fill="#355E3B" opacity="0.6"/>
            <line x1="15" y1="38" x2="15" y2="16" stroke="#E9DCC9" strokeWidth="1.5"/>
          </svg>
        </div>
      </div>
    )
  }

  if (user) return <BurrowScene user={user} />
  return <LandingPage />
}
