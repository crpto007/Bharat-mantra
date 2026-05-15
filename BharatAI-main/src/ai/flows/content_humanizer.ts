'use server';

/**
 * @fileOverview Converts AI-generated text to sound more natural and human-like.
 *
 * - contentHumanizer - The function that performs the conversion.
 * - ContentHumanizerInput - The input type for the contentHumanizer function.
 * - ContentHumanizerOutput - The return type for the contentHumanizer function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {z} from 'genkit';

const ContentHumanizerInputSchema = z.object({
  text: z.string().describe('The AI-generated text to be humanized.'),
  humanizeLevel: z.number().min(0).max(100).describe('The intensity of humanization from 0 (less) to 100 (more).'),
  outputLength: z.enum(['short', 'normal', 'long']).describe('The desired length of the output text.'),
  language: z.string().describe('The language for the response (e.g., "en" for English, "hi" for Hindi).'),
});
export type ContentHumanizerInput = z.infer<typeof ContentHumanizerInputSchema>;

const ContentHumanizerOutputSchema = z.object({
  humanizedText: z.string().describe('The text after being rewritten to sound more natural.'),
});
export type ContentHumanizerOutput = z.infer<typeof ContentHumanizerOutputSchema>;

export async function contentHumanizer(input: ContentHumanizerInput): Promise<ContentHumanizerOutput> {
  return contentHumanizerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contentHumanizerPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: ContentHumanizerInputSchema},
  output: {schema: ContentHumanizerOutputSchema},
  prompt: `You are an expert editor. Rewrite the following text to make it sound more natural, engaging, and human-like.
  The user has specified a humanization intensity of {{humanizeLevel}} out of 100, where 100 is maximum human-likeness. Adjust your tone, use of idioms, and sentence structure accordingly.
  The user wants the final output to be "{{outputLength}}" in length. Please adhere to this length requirement.
  Avoid robotic phrasing, overly complex sentences, and jargon. Use a clear, engaging, and personal tone.
  
  Rewrite the text in the following language: {{language}}. If the language is 'hi', use Devanagari script.

  Original Text:
  {{{text}}}
  `,
});

const contentHumanizerFlow = ai.defineFlow(
  {
    name: 'contentHumanizerFlow',
    inputSchema: ContentHumanizerInputSchema,
    outputSchema: ContentHumanizerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
