'use server';

/**
 * @fileOverview Performs advanced analysis on a given topic using multi-step reasoning.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AdvancedAnalysisInputSchema = z.object({
  query: z.string(),
  language: z.string(),
});

export type AdvancedAnalysisInput = z.infer<
  typeof AdvancedAnalysisInputSchema
>;

const AdvancedAnalysisOutputSchema = z.object({
  analysis: z.string(),
});

export type AdvancedAnalysisOutput = z.infer<
  typeof AdvancedAnalysisOutputSchema
>;

export async function advancedAnalysis(
  input: AdvancedAnalysisInput
): Promise<AdvancedAnalysisOutput> {
  return advancedAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'advancedAnalysisPrompt',
  model: 'googleai/gemini-2.0-flash',

  input: {
    schema: AdvancedAnalysisInputSchema,
  },

  output: {
    schema: AdvancedAnalysisOutputSchema,
  },

  prompt: `
You are an expert analyst.

Perform a deep, detailed, multi-step analysis of the following topic.

Provide:
- Overview
- Key insights
- Detailed explanation
- Final conclusion

Respond in this language: {{language}}

Topic:
{{{query}}}
`,
});

const advancedAnalysisFlow = ai.defineFlow(
  {
    name: 'advancedAnalysisFlow',
    inputSchema: AdvancedAnalysisInputSchema,
    outputSchema: AdvancedAnalysisOutputSchema,
  },

  async (input) => {
    try {
      const { output } = await prompt(input);

      return {
        analysis:
          output?.analysis || 'No analysis generated.',
      };
    } catch (error) {
      console.error('Advanced Analysis Error:', error);

      return {
        analysis:
          'AI service temporarily unavailable.',
      };
    }
  }
);