'use server';

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';

const ChatbotMultilingualSupportInputSchema = z.object({
  language: z.string(),
  message: z.string(),
  context: z.string().optional(),
});

export type ChatbotMultilingualSupportInput = z.infer<
  typeof ChatbotMultilingualSupportInputSchema
>;

const ChatbotMultilingualSupportOutputSchema = z.object({
  response: z.string(),
});

export type ChatbotMultilingualSupportOutput = z.infer<
  typeof ChatbotMultilingualSupportOutputSchema
>;

export async function chatbotMultilingualSupport(
  input: ChatbotMultilingualSupportInput
): Promise<ChatbotMultilingualSupportOutput> {
  return chatbotMultilingualSupportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotMultilingualSupportPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: { schema: ChatbotMultilingualSupportInputSchema },
  output: { schema: ChatbotMultilingualSupportOutputSchema },
  prompt: `You are a helpful and friendly multilingual chatbot.
You must always reply in the language specified by the "language" parameter.
- If "language" is 'hi', you must reply in Hindi.
- Keep your responses natural and conversational.
- Use the previous conversation history provided in the "context" parameter if it is available.

Conversation History:
{{{context}}}

User:
{{{message}}}
`,
});

const chatbotMultilingualSupportFlow = ai.defineFlow(
  {
    name: 'chatbotMultilingualSupportFlow',
    inputSchema: ChatbotMultilingualSupportInputSchema,
    outputSchema: ChatbotMultilingualSupportOutputSchema,
  },
  async (input) => {
    const result = await prompt(input);

    if (!result?.output) {
      throw new Error("AI response failed");
    }

    return result.output;
  }
);
