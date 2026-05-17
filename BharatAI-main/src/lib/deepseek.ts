import OpenAI from "openai";

<<<<<<< HEAD
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
=======
const openRouterApiKey =
  process.env.OPENROUTER_API_KEY?.trim();

export const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL?.trim() ||
  "meta-llama/llama-3.3-70b-instruct:free";

export const AI_CONFIGURATION_ERROR =
  "AI service is not configured. Please set OPENROUTER_API_KEY on the server and restart the app.";

export const deepseek = new OpenAI({
  apiKey: openRouterApiKey || "missing-openrouter-api-key",
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer":
      process.env.OPENROUTER_SITE_URL ||
      "https://bharat-mantra.vercel.app",
    "X-Title": "Bharat Mantra",
  },
});

export function getAIErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "AI service temporarily unavailable. Please try again.";
>>>>>>> main
}

type GenerateTextOptions = {
  temperature?: number;
};

export async function generateAIText(
  prompt: string,
<<<<<<< HEAD
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
=======
  options: GenerateTextOptions = {}
) {
  if (!openRouterApiKey) {
    throw new Error(AI_CONFIGURATION_ERROR);
  }

  const response =
    await deepseek.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: options.temperature ?? 0.7,
    });

  const text =
    response.choices[0]?.message.content?.trim();

  if (!text) {
    throw new Error(
      "AI service returned an empty response. Please try again."
    );
  }

  return text;
>>>>>>> main
}
