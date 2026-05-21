'use server';

/**
 * @fileOverview Performs advanced analysis on a given topic using multi-step reasoning.
 *
 * - advancedAnalysis - A function that performs the analysis.
 * - AdvancedAnalysisInput - The input type for the advancedAnalysis function.
 * - AdvancedAnalysisOutput - The return type for the advancedAnalysis function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import {z} from 'genkit';

const AdvancedAnalysisInputSchema = z.object({
  query: z.string().describe('The complex query or topic for analysis.'),
  language: z.string().describe('The language for the response (e.g., "en" for English, "hi" for Hindi).'),
});
export type AdvancedAnalysisInput = z.infer<typeof AdvancedAnalysisInputSchema>;

const AdvancedAnalysisOutputSchema = z.object({
  analysis: z.string().describe('A detailed, long-form, and comprehensive analysis of the topic.'),
});
export type AdvancedAnalysisOutput = z.infer<typeof AdvancedAnalysisOutputSchema>;

export async function advancedAnalysis(input: AdvancedAnalysisInput): Promise<AdvancedAnalysisOutput> {
  return advancedAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'advancedAnalysisPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: AdvancedAnalysisInputSchema},
  output: {schema: AdvancedAnalysisOutputSchema},
  prompt: `You are an expert analyst. Your task is to perform a fully detailed, long-form, multi-step analysis of the following query.
  Leverage all of your internal knowledge to provide the most comprehensive response possible.
  Break down the problem, gather all available information, and synthesize it into a structured, long-form text response.
  Provide a comprehensive overview, key findings with detailed explanations, and a final conclusion.

  Please provide the analysis in the following language: {{language}}. If the language is 'hi', respond in Hindi using Devanagari script.

  Query: {{{query}}}
  `,
});

const advancedAnalysisFlow = ai.defineFlow(
  {
    name: 'advancedAnalysisFlow',
    inputSchema: AdvancedAnalysisInputSchema,
    outputSchema: AdvancedAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
