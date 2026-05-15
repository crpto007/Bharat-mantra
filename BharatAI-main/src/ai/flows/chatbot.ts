"use server";

import { ai } from "@/ai/genkit";
import { googleAI } from "@genkit-ai/googleai";
import { z } from "zod";

export const chatbotMultilingualSupport = ai.defineFlow(
  {
    name: "chatbotMultilingualSupport",

    inputSchema: z.object({
      message: z.string(),
      language: z.string(),
      context: z.string().optional(),
    }),

    outputSchema: z.object({
      response: z.string(),
    }),
  },

  async (input) => {
    try {
      const prompt = `
You are BharatAI, a helpful multilingual AI assistant.

Language: ${input.language}

Previous conversation:
${input.context ?? "No previous context"}

User message:
${input.message}

Instructions:
- Reply in the selected language
- Be clear and helpful
- Keep answers concise but informative
`;

      const result = await ai.generate({
         model:("googleai/gemini-2.0-flash"),
        prompt,
        config: {
          temperature: 0.7,
        },
      });

      return {
        response:
          result.text ?? "Sorry, I couldn't generate a response.",
      };
    } catch (error) {
      console.error("AI Error:", error);

      return {
        response: "AI service error. Please try again.",
      };
    }
  }
);
