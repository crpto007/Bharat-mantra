import OpenAI from "openai";

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
export const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free";

let client: OpenAI | null = null;

function getOpenRouterClient() {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is not configured. Add it to your environment to enable AI features.",
    );
  }

  if (!client) {
    client = new OpenAI({
      apiKey,
      baseURL: OPENROUTER_BASE_URL,
      defaultHeaders: {
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_APP_URL || "https://bharat-mantra.vercel.app",
        "X-Title": "Bharat Mantra",
      },
    });
  }

  return client;
}

type GenerateTextOptions = {
  temperature?: number;
};

export async function generateAIText(
  prompt: string,
  options: GenerateTextOptions = {},
) {
  const response = await getOpenRouterClient().chat.completions.create({
    model: OPENROUTER_MODEL,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: options.temperature,
  });

  return response.choices[0]?.message?.content?.trim() || "";
}

export function getAIErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "AI service temporarily unavailable.";
}
