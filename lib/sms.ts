// ── SMS delivery via Twilio REST API ──────────────────────────────────────────
// Uses the Twilio REST API directly — no SDK dependency.
// Required env vars: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_MESSAGING_SERVICE_SID.
// ─────────────────────────────────────────────────────────────────────────────

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://whimsical-bear.vercel.app'

export interface SMSPayload {
  to:    string   // E.164 format e.g. "+15550001234"
  quote: string
  date:  string   // ISO date string
}

export async function sendSMS(payload: SMSPayload): Promise<void> {
  const { to, quote, date } = payload

  const accountSid          = process.env.TWILIO_ACCOUNT_SID!
  const authToken           = process.env.TWILIO_AUTH_TOKEN!
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID!

  const formattedDate = new Date(date + 'T00:00:00Z').toLocaleDateString('en-US', {
    weekday: 'short',
    month:   'short',
    day:     'numeric',
    timeZone: 'UTC',
  })

  // Keep SMS under 160 chars where possible; split across natural segments
  const body = [
    `Whimsical Bear — ${formattedDate}`,
    `\u201c${quote}\u201d`,
    `Visit the clearing: ${APP_URL}`,
  ].join('\n\n')

  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64')

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method:  'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type':  'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ Body: body, MessagingServiceSid: messagingServiceSid, To: to }).toString(),
    },
  )

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(`[woodland:sms] Twilio replied with ${res.status}: ${JSON.stringify(data)}`)
  }
}
