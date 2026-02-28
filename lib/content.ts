// ── Daily content generation ───────────────────────────────────────────────────
// generateQuote() calls Claude to write today's morning whisper.
// generateImage() returns the static bear for now (swap for AI image later).
// ─────────────────────────────────────────────────────────────────────────────

// Fallback pool — used when ANTHROPIC_API_KEY is not set or the call fails
const FALLBACK_QUOTES = [
  'The creek is unhurried this morning, and for now, so are you.',
  'The forest does not hurry, yet everything is accomplished in its season.',
  'Rest is not idleness — it is listening to what the roots have to say.',
  'Even the oldest oak began as something that simply decided to grow.',
  'You do not have to be large to leave a gentle mark on the world.',
  'The river does not apologise for the path it has chosen.',
  'There is enough light in a single ember to warm a whole evening.',
  'Whatever is heavy today will be carried more easily by two.',
  'The mushroom asks nothing of the stone — and yet, together, they make a home.',
  'Stillness is not emptiness. It is the place where things begin.',
  'The mist is still heavy on the moss; there is no rush to find the path today.',
  'The old oaks do not worry about the wind; they simply lean into the morning.',
]

// ── System prompt — the voice of the forest caretaker ────────────────────────

const QUOTE_SYSTEM_PROMPT = `\
You are the voice of a wise, rustic, and gentle forest caretaker. \
Your goal is to write a single "Good Morning" message for a whimsical woodland app. \
The tone is cozy, slow, and deeply grounded in nature.

Rules:
- Length: between 10 and 20 words exactly.
- No clichés: never use "hustle," "grind," "success," "productivity," "manifest," or "Rise and Shine."
- Imagery: include one specific woodland sensory detail \
  (e.g. the smell of pine needles, the weight of dew, the sound of a distant creek, the texture of bark).
- The quote should feel like a warm, slow smile — about being, not doing.
- Formatting: sentence case, ending with a period. No quotation marks. No emojis. No attribution.
- Output only the quote — nothing else.`

// ── Public API ─────────────────────────────────────────────────────────────────

export interface DailyMoment {
  quote:     string
  image_url: string | null
}

export async function generateMoment(): Promise<DailyMoment> {
  const [quote, image_url] = await Promise.all([
    generateQuote(),
    generateImage(),
  ])
  return { quote, image_url }
}

// ── Internals ──────────────────────────────────────────────────────────────────

async function generateQuote(): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.warn('[woodland:content] ANTHROPIC_API_KEY not set — using fallback quote.')
    return fallbackQuote()
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: {
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
        'content-type':      'application/json',
      },
      body: JSON.stringify({
        model:      'claude-opus-4-6',
        max_tokens: 80,
        system:     QUOTE_SYSTEM_PROMPT,
        messages:   [{
          role:    'user',
          content: 'Generate today\'s morning whisper for the Whimsical Bear.',
        }],
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(`Anthropic ${res.status}: ${JSON.stringify(err)}`)
    }

    const data = await res.json()
    const quote = (data.content?.[0]?.text ?? '').trim()

    if (!quote) throw new Error('Empty response from Anthropic')

    console.log(`[woodland:content] Today's whisper: "${quote}"`)
    return quote

  } catch (err) {
    console.error('[woodland:content] Quote generation failed — using fallback:', err)
    return fallbackQuote()
  }
}

const IMAGE_PROMPT =
  'A high-resolution, macro-detail portrait of a rustic, homemaking brown bear ' +
  'in a sun-drenched woodland clearing. Hyper-realistic fur. Peaceful, sleepy expression. ' +
  'Easter egg: tiny yellow duck nestled in neck fur. Golden hour rim-lighting. ' +
  'Colour palette: warm browns #7B3F00 and #6F4E37, golden highlights #E5AA70. ' +
  'Style: National Geographic photography meets cozy storybook illustration.'

async function generateImage(): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.warn('[woodland:content] OPENAI_API_KEY not set — using fallback image.')
    return '/bear-portrait.png'
  }

  try {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        model:   'dall-e-3',
        prompt:  IMAGE_PROMPT,
        n:       1,
        size:    '1024x1024',
        quality: 'standard',
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(`OpenAI ${res.status}: ${JSON.stringify(err)}`)
    }

    const data = await res.json()
    const url  = data.data?.[0]?.url as string | undefined

    if (!url) throw new Error('No image URL in OpenAI response')

    console.log('[woodland:content] Bear portrait generated.')
    return url

  } catch (err) {
    console.error('[woodland:content] Image generation failed — using fallback:', err)
    return '/bear-portrait.png'
  }
}

function fallbackQuote(): string {
  const i = new Date().getUTCDate() % FALLBACK_QUOTES.length
  return FALLBACK_QUOTES[i]
}
