// ── Daily content generation ───────────────────────────────────────────────────
// Each function has a placeholder implementation clearly marked TODO.
// Swap the bodies for real API calls (Anthropic, DALL-E, Replicate, etc.)
// without touching any of the callers.
// ─────────────────────────────────────────────────────────────────────────────

const PLACEHOLDER_QUOTES = [
  'Every small creature finds its shelter, and so, in time, will you.',
  'The forest does not hurry, yet everything is accomplished in its season.',
  'Rest is not idleness — it is listening to what the roots have to say.',
  'Even the oldest oak began as something that simply decided to grow.',
  'You do not have to be large to leave a gentle mark on the world.',
  'The river does not apologise for the path it has chosen.',
  'There is enough light in a single ember to warm a whole evening.',
  'Whatever is heavy today will be carried more easily by two.',
  'The mushroom asks nothing of the stone — and yet, together, they make a home.',
  'Stillness is not emptiness. It is the place where things begin.',
]

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
  // TODO: replace with Anthropic / OpenAI API call.
  // Example skeleton:
  //
  //   const res = await fetch('https://api.anthropic.com/v1/messages', {
  //     method: 'POST',
  //     headers: {
  //       'x-api-key':         process.env.ANTHROPIC_API_KEY!,
  //       'anthropic-version': '2023-06-01',
  //       'content-type':      'application/json',
  //     },
  //     body: JSON.stringify({
  //       model:      'claude-opus-4-6',
  //       max_tokens: 120,
  //       messages: [{
  //         role:    'user',
  //         content: 'Write one short, woodland-whimsical inspirational quote (1–2 sentences). No attribution.',
  //       }],
  //     }),
  //   })
  //   const data = await res.json()
  //   return data.content[0].text.trim()

  const i = new Date().getUTCDate() % PLACEHOLDER_QUOTES.length
  return PLACEHOLDER_QUOTES[i]
}

async function generateImage(): Promise<string | null> {
  // TODO: replace with image generation API call.
  // The prompt to use:
  //
  //   "A high-resolution, macro-detail portrait of a rustic, homemaking brown
  //    bear in a sun-drenched woodland clearing. Hyper-realistic fur. Peaceful,
  //    sleepy expression. Easter Egg: tiny yellow duck nestled in neck fur.
  //    Golden hour rim-lighting. Palette: #7B3F00, #6F4E37, #E5AA70.
  //    Style: National Geographic + cozy storybook illustration."
  //
  // Example skeleton (DALL-E 3):
  //
  //   const res = await fetch('https://api.openai.com/v1/images/generations', {
  //     method: 'POST',
  //     headers: {
  //       'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
  //       'Content-Type':  'application/json',
  //     },
  //     body: JSON.stringify({ prompt: BEAR_PROMPT, model: 'dall-e-3', n: 1, size: '1024x1024' }),
  //   })
  //   const data = await res.json()
  //   return data.data[0].url

  return '/bear-portrait.png'
}
