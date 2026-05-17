import OpenAI from "openai";

const openRouterApiKey = process.env.OPENROUTER_API_KEY;
const openRouterModel =
  process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free";
const appUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://bharat-mantra.vercel.app";

let client: OpenAI | null = null;

function getClient() {
  if (!openRouterApiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is not configured. Add it to your server environment to enable AI features.",
    );
  }

  client ??= new OpenAI({
    apiKey: openRouterApiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": appUrl,
      "X-Title": "Bharat Mantra",
    },
  });

  return client;
}

export async function generateAIText({
  prompt,
  temperature = 0.7,
}: {
  prompt: string;
  temperature?: number;
}) {
  const response = await getClient().chat.completions.create({
    model: openRouterModel,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature,
  });

  return response.choices[0]?.message?.content?.trim() || "";
}

export function getAIErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "AI service temporarily unavailable.";
}
