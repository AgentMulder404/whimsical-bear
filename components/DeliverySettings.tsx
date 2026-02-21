'use client'

import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { updatePreferences } from '@/app/actions/updatePreferences'

// ── Data ──────────────────────────────────────────────────────────────────────

const DAYS = [
  { id: 'mon', label: 'Mon', full: 'Monday'    },
  { id: 'tue', label: 'Tue', full: 'Tuesday'   },
  { id: 'wed', label: 'Wed', full: 'Wednesday' },
  { id: 'thu', label: 'Thu', full: 'Thursday'  },
  { id: 'fri', label: 'Fri', full: 'Friday'    },
  { id: 'sat', label: 'Sat', full: 'Saturday'  },
  { id: 'sun', label: 'Sun', full: 'Sunday'    },
]

const TIMES = [
  { id: 'dawn',      label: 'Dawn',      clock: '6 AM'  },
  { id: 'morning',   label: 'Morning',   clock: '9 AM'  },
  { id: 'midday',    label: 'Midday',    clock: '12 PM' },
  { id: 'afternoon', label: 'Afternoon', clock: '3 PM'  },
  { id: 'dusk',      label: 'Dusk',      clock: '6 PM'  },
]

const METHODS = [
  { id: 'email', label: 'By Letter',  sub: 'Email'    },
  { id: 'sms',   label: 'By Cricket', sub: 'SMS'      },
  { id: 'both',  label: 'Both Paths', sub: 'Email & SMS' },
] as const
type Method = (typeof METHODS)[number]['id']

const ALL_DAYS   = DAYS.map(d => d.id)
const WEEKDAYS   = ['mon', 'tue', 'wed', 'thu', 'fri']
const WEEKENDS   = ['sat', 'sun']

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDays(selected: string[]): string {
  if (selected.length === 0) return 'no days yet'
  if (selected.length === 7) return 'every day'
  if (WEEKDAYS.every(d => selected.includes(d)) && selected.length === 5)
    return 'every weekday'
  if (WEEKENDS.every(d => selected.includes(d)) && selected.length === 2)
    return 'every weekend'
  if (selected.length === 1)
    return 'every ' + (DAYS.find(d => d.id === selected[0])?.full ?? selected[0])
  return selected.map(id => DAYS.find(d => d.id === id)?.label ?? id).join(', ')
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function DeliverySettings() {
  const [user,        setUser]        = useState<User | null>(null)
  const [token,       setToken]       = useState('')
  const [days,        setDays]        = useState<string[]>(ALL_DAYS)
  const [time,        setTime]        = useState('morning')
  const [method,      setMethod]      = useState<Method>('email')
  const [saving,      setSaving]      = useState(false)
  const [saved,       setSaved]       = useState(false)
  const [errorMsg,    setErrorMsg]    = useState('')

  // Resolve session — handles both existing sessions and the email-confirmation
  // redirect (Supabase writes the token into the URL hash on arrival).
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setToken(session?.access_token ?? '')
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      setToken(session?.access_token ?? '')
    })

    return () => subscription.unsubscribe()
  }, [])

  // ── Handlers ────────────────────────────────────────────────────────────────

  const toggleDay = (id: string) => {
    setDays(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id])
    setSaved(false)
  }

  const applyPreset = (preset: 'all' | 'weekdays' | 'weekends') => {
    setDays(preset === 'all' ? ALL_DAYS : preset === 'weekdays' ? WEEKDAYS : WEEKENDS)
    setSaved(false)
  }

  const handleSave = async () => {
    if (!user || !token || days.length === 0) return
    setSaving(true)
    setErrorMsg('')
    setSaved(false)

    try {
      await updatePreferences(token, user.id, {
        days_of_week:    days,
        preferred_time:  time,
        delivery_method: method,
      })
      setSaved(true)
    } catch {
      setErrorMsg('The woodland is quiet right now — please try again.')
    } finally {
      setSaving(false)
    }
  }

  // ── Preview values ───────────────────────────────────────────────────────────

  const previewDays   = formatDays(days)
  const previewClock  = TIMES.find(t => t.id === time)?.clock  ?? '9 AM'
  const previewMethod = METHODS.find(m => m.id === method)?.sub ?? 'Email'

  const nextDay = days.length > 0
    ? DAYS.find(d => d.id === days[0])?.full ?? 'soon'
    : 'a day yet to be chosen'

  // ── Unauthenticated guard ────────────────────────────────────────────────────

  if (!user) {
    return (
      <div className="text-center py-16 px-4">
        <div className="mb-6 flex justify-center" aria-hidden="true">
          <TreeGlyph />
        </div>
        <p className="font-serif text-deep-brown text-xl mb-3">
          The clearing isn&rsquo;t quite ready yet.
        </p>
        <p className="font-sans text-coffee/60 text-sm leading-relaxed max-w-xs mx-auto">
          Please confirm your email first — a small bird is waiting to guide you here.
        </p>
      </div>
    )
  }

  // ── Settled ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">

      {/* ── Days ──────────────────────────────────────────────────────────────── */}
      <Section label="When shall the woods find you?">

        {/* Quick presets */}
        <div className="flex gap-2 flex-wrap mb-4">
          {(['all', 'weekdays', 'weekends'] as const).map((preset) => {
            const label = preset === 'all' ? 'Every dawn' : preset === 'weekdays' ? 'Weekdays' : 'Weekends'
            const active =
              preset === 'all'      ? days.length === 7 :
              preset === 'weekdays' ? (days.length === 5 && WEEKDAYS.every(d => days.includes(d))) :
                                     (days.length === 2 && WEEKENDS.every(d => days.includes(d)))
            return (
              <button
                key={preset}
                onClick={() => applyPreset(preset)}
                className={`
                  font-sans text-xs px-3.5 py-1.5 rounded-full border transition-all duration-200
                  ${active
                    ? 'bg-ochre/20 border-ochre text-deep-brown font-semibold'
                    : 'bg-parchment/50 border-golden/30 text-coffee/60 hover:border-ochre/60 hover:text-coffee'}
                `}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Individual day pills */}
        <div className="grid grid-cols-7 gap-1.5">
          {DAYS.map(({ id, label }) => {
            const active = days.includes(id)
            const isWeekend = id === 'sat' || id === 'sun'
            return (
              <button
                key={id}
                onClick={() => toggleDay(id)}
                aria-pressed={active}
                aria-label={label}
                className={`
                  flex flex-col items-center py-2.5 rounded-2xl border text-xs font-sans
                  transition-all duration-200 active:scale-95
                  ${active
                    ? 'bg-ochre/20 border-ochre text-deep-brown font-semibold shadow-[0_2px_8px_rgba(204,119,34,0.18)]'
                    : `bg-parchment/50 border-golden/25 hover:border-ochre/50
                       ${isWeekend ? 'text-moss/70' : 'text-coffee/55'}`}
                `}
              >
                {label}
              </button>
            )
          })}
        </div>
      </Section>

      {/* ── Time ──────────────────────────────────────────────────────────────── */}
      <Section label="At what hour?">
        <div className="grid grid-cols-5 gap-2">
          {TIMES.map(({ id, label, clock }) => {
            const active = time === id
            return (
              <button
                key={id}
                onClick={() => { setTime(id); setSaved(false) }}
                aria-pressed={active}
                className={`
                  flex flex-col items-center gap-0.5 py-3 rounded-2xl border text-xs font-sans
                  transition-all duration-200 active:scale-95
                  ${active
                    ? 'bg-ochre/20 border-ochre text-deep-brown font-semibold shadow-[0_2px_8px_rgba(204,119,34,0.18)]'
                    : 'bg-parchment/50 border-golden/25 text-coffee/55 hover:border-ochre/50'}
                `}
              >
                <span className={active ? 'text-deep-brown' : 'text-coffee/70'}>{label}</span>
                <span className={`text-[10px] ${active ? 'text-ochre' : 'text-coffee/35'}`}>{clock}</span>
              </button>
            )
          })}
        </div>
      </Section>

      {/* ── Delivery method ───────────────────────────────────────────────────── */}
      <Section label="How shall the message arrive?">
        <div className="grid grid-cols-3 gap-2">
          {METHODS.map(({ id, label, sub }) => {
            const active = method === id
            return (
              <button
                key={id}
                onClick={() => { setMethod(id); setSaved(false) }}
                aria-pressed={active}
                className={`
                  flex flex-col items-center gap-0.5 py-3.5 rounded-2xl border text-xs font-sans
                  transition-all duration-200 active:scale-95
                  ${active
                    ? 'bg-ochre/20 border-ochre text-deep-brown font-semibold shadow-[0_2px_8px_rgba(204,119,34,0.18)]'
                    : 'bg-parchment/50 border-golden/25 text-coffee/55 hover:border-ochre/50'}
                `}
              >
                <span>{label}</span>
                <span className={`text-[10px] ${active ? 'text-ochre' : 'text-coffee/35'}`}>{sub}</span>
              </button>
            )
          })}
        </div>
      </Section>

      {/* ── Preview card ──────────────────────────────────────────────────────── */}
      <div className="
        bg-parchment/70 border border-golden/40 rounded-3xl
        px-6 py-5
        shadow-[0_4px_20px_rgba(229,170,112,0.18)]
      ">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 shrink-0" aria-hidden="true">
            <BearStamp />
          </div>
          <div>
            <p className="font-sans text-[10px] text-coffee/40 tracking-widest uppercase mb-1.5">
              Your rhythm
            </p>
            <p className="font-serif text-deep-brown text-base leading-snug">
              {days.length === 0
                ? 'Choose at least one day to see your preview.'
                : <>
                    You&rsquo;ll hear from the woods{' '}
                    <span className="text-forest font-semibold">{previewDays}</span>
                    {' '}at{' '}
                    <span className="text-forest font-semibold">{previewClock}</span>
                    {' '}by{' '}
                    <span className="text-forest font-semibold">{previewMethod}</span>.
                  </>
              }
            </p>
            {days.length > 0 && (
              <p className="font-sans text-coffee/45 text-xs mt-2">
                Your first bear arrives this {nextDay}.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Error ─────────────────────────────────────────────────────────────── */}
      {errorMsg && (
        <p role="alert" className="font-sans text-xs text-rust/80 text-center px-2">
          {errorMsg}
        </p>
      )}

      {/* ── Save ──────────────────────────────────────────────────────────────── */}
      <button
        onClick={handleSave}
        disabled={saving || days.length === 0}
        className="
          btn-cta
          w-full rounded-2xl py-3.5
          bg-forest text-offwhite
          font-sans font-semibold text-sm
          shadow-[0_2px_14px_rgba(53,94,59,0.22)]
          hover:bg-moss hover:shadow-[0_4px_22px_rgba(53,94,59,0.28)]
          active:scale-[0.98]
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
        "
      >
        {saving ? 'Sending word to the woodland\u2026' :
         saved  ? 'Rhythm saved — see you soon.' :
                  'Set my delivery rhythm'}
      </button>

    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="
      bg-parchment/50 border border-golden/30 rounded-3xl
      px-5 py-5
    ">
      <p className="font-serif text-deep-brown text-base mb-4">{label}</p>
      {children}
    </div>
  )
}

function BearStamp() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="18" fill="#E5AA70" opacity="0.22"/>
      <circle cx="18" cy="17" r="9"  fill="#7B3F00"/>
      <circle cx="12" cy="10" r="4"  fill="#7B3F00"/>
      <circle cx="24" cy="10" r="4"  fill="#7B3F00"/>
      <ellipse cx="18" cy="21" rx="4" ry="3.2" fill="#6F4E37" opacity="0.55"/>
      <ellipse cx="18" cy="19.5" rx="1.6" ry="1.2" fill="#2e1600" opacity="0.80"/>
      <circle cx="14.5" cy="15.5" r="1.8" fill="#2e1600" opacity="0.82"/>
      <circle cx="21.5" cy="15.5" r="1.8" fill="#2e1600" opacity="0.82"/>
    </svg>
  )
}

function TreeGlyph() {
  return (
    <svg width="48" height="56" viewBox="0 0 48 56" fill="none">
      <ellipse cx="24" cy="18" rx="20" ry="16" fill="#355E3B" opacity="0.82"/>
      <ellipse cx="24" cy="24" rx="14" ry="12" fill="#40826D" opacity="0.55"/>
      <rect x="20" y="36" width="8" height="20" rx="3" fill="#6F4E37"/>
    </svg>
  )
}
