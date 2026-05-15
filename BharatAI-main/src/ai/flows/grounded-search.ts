'use server';

/**
 * @fileOverview A topic search and summarization AI agent.
 *
 * - groundedSearchSummarization - A function that handles the topic search and summarization process.
 * - GroundedSearchSummarizationInput - The input type for the groundedSearchSummarization function.
 * - GroundedSearchSummarizationOutput - The return type for the groundedSearchSummarization function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {z} from 'genkit';

const GroundedSearchSummarizationInputSchema = z.object({
  query: z.string().describe('The search query or topic to summarize.'),
  language: z.string().describe('The language for the response (e.g., "en" for English, "hi" for Hindi).'),
});
export type GroundedSearchSummarizationInput = z.infer<
  typeof GroundedSearchSummarizationInputSchema
>;

const GroundedSearchSummarizationOutputSchema = z.object({
  summary: z
    .string()
    .describe('A detailed, long-form summary of the topic, including an overview, key findings, and a conclusion.'),
});
export type GroundedSearchSummarizationOutput = z.infer<
  typeof GroundedSearchSummarizationOutputSchema
>;

export async function groundedSearchSummarization(
  input: GroundedSearchSummarizationInput
): Promise<GroundedSearchSummarizationOutput> {
  return groundedSearchSummarizationFlow(input);
}

const summarizeSourcesPrompt = ai.definePrompt({
  name: 'summarizeSourcesPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: GroundedSearchSummarizationInputSchema},
  output: {schema: GroundedSearchSummarizationOutputSchema},
  prompt: `You are an AI assistant tasked with researching a topic and providing a summary.

  Perform a web search to research the topic thoroughly.
  Your response must be based on the information you find.

  Topic: {{{query}}}

  Please provide the summary in the following language: {{language}}. If the language is 'hi', respond in Hindi using Devanagari script.
  
  The summary should include a comprehensive overview, key findings with detailed explanations, and a final conclusion.
  
  Do not include or mention any source URLs in the summary.
  `,
});

const groundedSearchSummarizationFlow = ai.defineFlow(
  {
    name: 'groundedSearchSummarizationFlow',
    inputSchema: GroundedSearchSummarizationInputSchema,
    outputSchema: GroundedSearchSummarizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
