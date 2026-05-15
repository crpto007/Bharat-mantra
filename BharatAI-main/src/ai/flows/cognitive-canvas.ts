'use server';
/**
 * @fileOverview An AI brainstorming assistant that organizes raw ideas and suggests new ones.
 *
 * - cognitiveCanvas - A function that handles the brainstorming analysis.
 * - CognitiveCanvasInput - The input type for the cognitiveCanvas function.
 * - CognitiveCanvasOutput - The return type for the cognitiveCanvas function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {z} from 'genkit';

const CognitiveCanvasInputSchema = z.object({
  rawText: z.string().describe('A raw dump of brainstorming notes, ideas, and keywords.'),
  language: z.string().describe('The language for the response (e.g., "en" for English, "hi" for Hindi).'),
});
export type CognitiveCanvasInput = z.infer<typeof CognitiveCanvasInputSchema>;

const CognitiveCanvasOutputSchema = z.object({
  organizedContent: z.string().describe('The user\'s ideas, structured as a coherent mind map or outline in Markdown format.'),
  suggestions: z.string().describe('A list of new, related ideas or suggested connections between existing ones, in Markdown format.'),
});
export type CognitiveCanvasOutput = z.infer<typeof CognitiveCanvasOutputSchema>;

export async function cognitiveCanvas(input: CognitiveCanvasInput): Promise<CognitiveCanvasOutput> {
  return cognitiveCanvasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cognitiveCanvasPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: CognitiveCanvasInputSchema},
  output: {schema: CognitiveCanvasOutputSchema},
  prompt: `You are an expert AI brainstorming facilitator. Your task is to take a raw dump of text containing ideas, notes, and keywords, and transform it into a structured and insightful analysis.

  Please perform the following two tasks in the specified language ({{language}}). If the language is 'hi', use Devanagari script.

  1.  **Organize Content**: Read through all the raw text. Identify the main themes and group related ideas together. Structure this information as a detailed, hierarchical mind map or outline using Markdown (e.g., using headings, nested lists). This should be a clear and organized representation of the user's initial thoughts.
  2.  **Provide Suggestions**: After organizing the content, analyze the themes and ideas to suggest new connections, potential next steps, or completely new, related ideas that the user might have missed. Present these as a separate list of actionable insights.

  Raw Brainstorming Text:
  {{{rawText}}}
  `,
});

const cognitiveCanvasFlow = ai.defineFlow(
  {
    name: 'cognitiveCanvasFlow',
    inputSchema: CognitiveCanvasInputSchema,
    outputSchema: CognitiveCanvasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
