# Bharat Mantra

Next.js app for AI chat, prompt enhancement, document generation, health planning, law explanation, and related productivity tools.

## AI configuration

Server-side AI features use OpenRouter through `src/lib/deepseek.ts`.

Required environment variable:

```bash
OPENROUTER_API_KEY=your_openrouter_api_key
```

Optional environment variables:

```bash
# One preferred model. Defaults to OpenRouter's free router.
OPENROUTER_MODEL=openrouter/free

# Comma-separated fallback list. If set, this list is tried in order.
OPENROUTER_MODELS=openrouter/free,meta-llama/llama-3.3-70b-instruct:free

# Used for OpenRouter app attribution headers.
NEXT_PUBLIC_APP_URL=https://bharat-mantra.vercel.app
```

If a selected provider returns `429` rate-limit errors, the app retries the next configured model. If all configured models are rate-limited, the API returns a clear 429 message so the UI can tell users to retry or configure a less-limited/paid model.
