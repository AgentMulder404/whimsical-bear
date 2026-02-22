// ── Auth Callback Page ─────────────────────────────────────────────────────────
// Supabase email confirmation links redirect here with ?code=XXX.
// The client component exchanges the code for a session (stored in localStorage)
// then redirects to /settings where the user can set their delivery rhythm.
// ─────────────────────────────────────────────────────────────────────────────

import AuthCallbackClient from '@/components/AuthCallbackClient'

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string; error_description?: string }>
}) {
  const { code, error, error_description } = await searchParams
  return <AuthCallbackClient code={code} error={error} errorDescription={error_description} />
}
