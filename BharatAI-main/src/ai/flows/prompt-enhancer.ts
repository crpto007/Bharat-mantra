'use server';
/**
 * @fileOverview Enhances user prompts for the chatbot to improve response quality.
 *
 * - enhancePromptForChatbot - A function that enhances the user's prompt for better chatbot responses.
 * - EnhancePromptForChatbotInput - The input type for the enhancePromptForChatbot function.
 * - EnhancePromptForChatbotOutput - The return type for the enhancePromptForChatbot function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {z} from 'genkit';

const EnhancePromptForChatbotInputSchema = z.object({
  prompt: z.string().describe('The original user prompt for the chatbot.'),
  language: z.string().describe('The language for the response (e.g., "en" for English, "hi" for Hindi).'),
});
export type EnhancePromptForChatbotInput = z.infer<typeof EnhancePromptForChatbotInputSchema>;

const EnhancePromptForChatbotOutputSchema = z.object({
  enhancedPrompt: z.string().describe('The enhanced, concise, and effective prompt for the chatbot.'),
});
export type EnhancePromptForChatbotOutput = z.infer<typeof EnhancePromptForChatbotOutputSchema>;

export async function enhancePromptForChatbot(input: EnhancePromptForChatbotInput): Promise<EnhancePromptForChatbotOutput> {
  return enhancePromptForChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhancePromptForChatbotPrompt',
   model:("googleai/gemini-2.0-flash"),
  input: {schema: EnhancePromptForChatbotInputSchema},
  output: {schema: EnhancePromptForChatbotOutputSchema},
  prompt: `You are an AI prompt engineering expert. Your task is to rewrite a user's prompt to be clearer, more specific, and highly effective, while remaining concise.
  The goal is to get the best possible response from a generative AI model with an efficient prompt.
  
  Use your expert knowledge to understand the user's intent from their original prompt and add relevant context, keywords, and a desired output format to make it powerful.

  Rewrite the prompt in the following language: {{language}}. If the language is 'hi', use Devanagari script.

  Original Prompt: {{{prompt}}}

  Rewrite it into a powerful and effective prompt.`,
});

const enhancePromptForChatbotFlow = ai.defineFlow(
  {
    name: 'enhancePromptForChatbotFlow',
    inputSchema: EnhancePromptForChatbotInputSchema,
    outputSchema: EnhancePromptForChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
