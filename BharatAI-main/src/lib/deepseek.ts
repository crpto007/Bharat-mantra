import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { ChatCompletion } from "openai/resources/chat/completions";

const openRouterApiKey = process.env.OPENROUTER_API_KEY;
const appUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://bharat-mantra.vercel.app";

const fallbackModel = "openrouter/free";
const defaultModels = [
  process.env.OPENROUTER_MODEL || fallbackModel,
  fallbackModel,
  "meta-llama/llama-3.3-70b-instruct:free",
];

const openRouterModels = getConfiguredModels();

let client: OpenAI | null = null;

type OpenRouterError = Error & {
  status?: number;
  code?: string | number;
  error?: {
    code?: string | number;
    message?: string;
    type?: string;
  };
};

type ChatCompletionRequest = Parameters<
  OpenAI["chat"]["completions"]["create"]
>[0] & {
  extra_body?: {
    models?: string[];
  };
};

function getConfiguredModels() {
  const configuredModels =
    process.env.OPENROUTER_MODELS?.split(",")
      .map((model) => model.trim())
      .filter(Boolean) ?? [];
  const models = configuredModels.length > 0 ? configuredModels : defaultModels;

  return [...new Set(models.map((model) => model.trim()).filter(Boolean))];
}

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

function toStatusCode(value: string | number | undefined) {
  const status = typeof value === "string" ? Number(value) : value;

  return Number.isInteger(status) ? status : undefined;
}

function getErrorStatus(error: unknown) {
  const openRouterError = error as OpenRouterError;

  return (
    toStatusCode(openRouterError.status) ??
    toStatusCode(openRouterError.code) ??
    toStatusCode(openRouterError.error?.code)
  );
}

function isRetryableOpenRouterError(error: unknown) {
  const status = getErrorStatus(error);

  return status === 429 || (typeof status === "number" && status >= 500);
}

function getRawErrorMessage(error: unknown) {
  const openRouterError = error as OpenRouterError;

  return (
    openRouterError.error?.message ||
    (error instanceof Error ? error.message : undefined) ||
    "AI service temporarily unavailable."
  );
}

function buildCompletionRequest({
  prompt,
  temperature,
  model,
  fallbackModels,
}: {
  prompt: string;
  temperature: number;
  model: string;
  fallbackModels: string[];
}): ChatCompletionRequest {
  return {
    model,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature,
    ...(fallbackModels.length > 0
      ? {
          extra_body: {
            models: fallbackModels,
          },
        }
      : {}),
  };
}

export async function generateAIText({
  prompt,
  temperature = 0.7,
}: {
  prompt: string;
  temperature?: number;
}) {
  const [primaryModel, ...fallbackModels] = openRouterModels;

  if (!primaryModel) {
    throw new Error("No OpenRouter model is configured.");
  }

  try {
    const response = (await getClient().chat.completions.create(
      buildCompletionRequest({
        prompt,
        temperature,
        model: primaryModel,
        fallbackModels,
      }),
    )) as ChatCompletion;

    return response.choices[0]?.message?.content?.trim() || "";
  } catch (error) {
    if (!isRetryableOpenRouterError(error) || fallbackModels.length === 0) {
      throw error;
    }

    console.warn(
      `OpenRouter automatic fallback failed with ${getErrorStatus(error) ?? "an error"}; retrying each configured model individually.`,
      getRawErrorMessage(error),
    );
  }

  let lastError: unknown;

  for (const model of fallbackModels) {
    try {
      const response = (await getClient().chat.completions.create(
        buildCompletionRequest({
          prompt,
          temperature,
          model,
          fallbackModels: [],
        }),
      )) as ChatCompletion;

      return response.choices[0]?.message?.content?.trim() || "";
    } catch (error) {
      lastError = error;

      if (!isRetryableOpenRouterError(error)) {
        throw error;
      }

      console.warn(
        `OpenRouter model ${model} failed with ${getErrorStatus(error) ?? "an error"}; trying next configured model.`,
        getRawErrorMessage(error),
      );
    }
  }

  throw lastError;
}

export function getAIErrorMessage(error: unknown) {
  const status = getErrorStatus(error);

  if (status === 429) {
    return "The AI provider is rate limited right now. Please try again in a few minutes, or configure OPENROUTER_MODELS/OPENROUTER_MODEL with a paid or less-limited model.";
  }

  if (status === 401 || status === 403) {
    return "OpenRouter rejected the API key. Please check OPENROUTER_API_KEY in the server environment.";
  }

  return getRawErrorMessage(error);
}

export function getAIErrorStatus(error: unknown) {
  const status = getErrorStatus(error);

  if (status === 401 || status === 403 || status === 429) {
    return status;
  }

  return 500;
}

function logAIError(error: unknown) {
  const status = getErrorStatus(error);
  const message = getRawErrorMessage(error);

  if (status === 429) {
    console.warn(`OpenRouter rate limit: ${message}`);
    return;
  }

  if (status === 401 || status === 403) {
    console.warn(`OpenRouter authentication error: ${message}`);
    return;
  }

  console.error(error);
}

export function createAIErrorResponse(
  error: unknown,
  fallbackBody: Record<string, string | string[]> = {},
) {
  logAIError(error);

  return NextResponse.json(
    {
      ...fallbackBody,
      error: getAIErrorMessage(error),
    },
    {
      status: getAIErrorStatus(error),
    },
  );
}
