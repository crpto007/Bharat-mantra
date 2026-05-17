import OpenAI from "openai";

export const deepseek = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "missing-openrouter-api-key",

  baseURL: "https://openrouter.ai/api/v1",

  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "BharatAI",
  },
});