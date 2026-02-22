import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser-safe client (anon key, respects RLS)
// flowType 'pkce' ensures email confirmation links use a ?code= param that
// can be safely exchanged server-side or client-side for a real session.
export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: { flowType: 'pkce' },
})
