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

    const prompt = `
You are a helpful AI assistant.

Language: ${input.language}

Previous context:
${input.context}

User message:
${input.message}

Reply in the selected language.
`;

    const result = await ai.generate({
      model: googleAI.model("gemini-1.5-flash"),
      prompt,
    });

    return {
      response: result.text,
    };
  }
);