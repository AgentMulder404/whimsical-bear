// ── Email delivery via Resend ──────────────────────────────────────────────────
// Uses the Resend REST API directly — no SDK dependency.
// Set RESEND_API_KEY and RESEND_FROM_EMAIL in environment variables.
// ─────────────────────────────────────────────────────────────────────────────

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://whimsical-bear.vercel.app'

export interface EmailPayload {
  to:       string
  quote:    string
  imageUrl: string | null
  date:     string          // ISO date string e.g. "2026-02-21"
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const { to, quote, imageUrl, date } = payload

  const formattedDate = new Date(date + 'T00:00:00Z').toLocaleDateString('en-US', {
    weekday: 'long',
    month:   'long',
    day:     'numeric',
    timeZone: 'UTC',
  })

  const res = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      from:    process.env.RESEND_FROM_EMAIL ?? 'Whimsical Bear <onboarding@resend.dev>',
      to:      [to],
      subject: `Your woodland moment — ${formattedDate}`,
      html:    buildHtml({ quote, imageUrl, formattedDate }),
    }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(`[woodland:email] Resend replied with ${res.status}: ${JSON.stringify(body)}`)
  }
}

// ── HTML template ──────────────────────────────────────────────────────────────

function buildHtml({
  quote,
  imageUrl,
  formattedDate,
}: {
  quote:         string
  imageUrl:      string | null
  formattedDate: string
}) {
  const absoluteImage = imageUrl
    ? imageUrl.startsWith('http')
      ? imageUrl
      : `${APP_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
    : null

  const imgBlock = absoluteImage
    ? `<img src="${absoluteImage}" alt="Today's bear" width="480"
           style="width:100%;max-width:480px;border-radius:16px;display:block;margin:0 0 28px;"/>`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Your woodland moment</title>
</head>
<body style="margin:0;padding:0;background:#FAF9F6;font-family:Georgia,'Times New Roman',serif;">

  <div style="max-width:520px;margin:0 auto;padding:40px 24px 48px;">

    <!-- Date label -->
    <p style="
      font-family:'Helvetica Neue',Arial,sans-serif;
      font-size:11px;letter-spacing:0.12em;text-transform:uppercase;
      color:rgba(111,78,55,0.50);margin:0 0 28px;
    ">${formattedDate}</p>

    <!-- Bear illustration -->
    ${imgBlock}

    <!-- Quote -->
    <div style="border-left:2px solid rgba(229,170,112,0.55);padding-left:20px;margin:0 0 24px;">
      <p style="font-size:19px;line-height:1.65;color:#7B3F00;margin:0;font-style:italic;">
        &ldquo;${quote}&rdquo;
      </p>
    </div>

    <!-- Body copy -->
    <p style="
      font-family:'Helvetica Neue',Arial,sans-serif;
      font-size:14px;line-height:1.75;color:rgba(111,78,55,0.68);margin:0 0 28px;
    ">
      The bear has been sitting quietly beneath the oak, thinking of you.
      May this small thought find you well.
    </p>

    <!-- CTA -->
    <a href="${APP_URL}" style="
      display:inline-block;background:#355E3B;color:#FAF9F6;
      padding:13px 28px;border-radius:14px;text-decoration:none;
      font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;
    ">Visit the woodland</a>

    <!-- Divider -->
    <hr style="border:none;border-top:1px solid rgba(229,170,112,0.28);margin:36px 0 24px;"/>

    <!-- Footer -->
    <p style="
      font-family:'Helvetica Neue',Arial,sans-serif;
      font-size:11px;color:rgba(111,78,55,0.38);margin:0;line-height:1.65;
    ">
      You&rsquo;re receiving this because you stepped into the clearing at
      <a href="${APP_URL}" style="color:rgba(111,78,55,0.52);">whimsical&#8209;bear.vercel.app</a>.<br/>
      To change when the bear finds you, visit your
      <a href="${APP_URL}/settings" style="color:rgba(111,78,55,0.52);">delivery rhythm settings</a>.
    </p>

  </div>

</body>
</html>`
}
