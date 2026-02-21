'use server'

import { createClient } from '@supabase/supabase-js'

export interface DeliveryPrefs {
  days_of_week:    string[]
  preferred_time:  string
  delivery_method: 'email' | 'sms' | 'both'
}

// ── SQL to run once in Supabase SQL Editor ───────────────────────────────────
//
//  ALTER TABLE profiles
//    ADD COLUMN IF NOT EXISTS days_of_week    TEXT[] DEFAULT '{}',
//    ADD COLUMN IF NOT EXISTS delivery_method TEXT   DEFAULT 'email';
//
//  -- Allow authenticated users to update their own row
//  CREATE POLICY "Users can update own profile" ON profiles
//    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
//
// ─────────────────────────────────────────────────────────────────────────────

export async function updatePreferences(
  accessToken: string,
  userId:      string,
  prefs:       DeliveryPrefs,
) {
  // Build an authenticated server-side client using the user's JWT.
  // RLS enforces that a user can only update their own profile row.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } },
  )

  const { error } = await supabase
    .from('profiles')
    .update({
      days_of_week:    prefs.days_of_week,
      preferred_time:  prefs.preferred_time,
      delivery_method: prefs.delivery_method,
    })
    .eq('id', userId)

  if (error) throw new Error(error.message)

  return { success: true }
}
