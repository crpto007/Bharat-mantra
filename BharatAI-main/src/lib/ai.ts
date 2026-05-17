import { deepseek } from "@/lib/deepseek";

export const DEFAULT_AI_MODEL =
  process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free";

export const AI_CONFIGURATION_ERROR =
  "AI service is not configured. Please set OPENROUTER_API_KEY on the server.";

export async function generateAIText({
  prompt,
  temperature = 0.7,
}: {
  prompt: string;
  temperature?: number;
}) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error(AI_CONFIGURATION_ERROR);
  }

  const response = await deepseek.chat.completions.create({
    model: DEFAULT_AI_MODEL,
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
