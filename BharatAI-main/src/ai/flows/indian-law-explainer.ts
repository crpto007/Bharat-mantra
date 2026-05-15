'use server';

/**
 * @fileOverview A flow to explain Indian legal acts and clauses in plain language in both English and Hindi.
 *
 * - simplifyIndianLaw - A function that handles the explanation process.
 * - SimplifyIndianLawInput - The input type for the simplifyIndianLaw function.
 * - SimplifyIndianLawOutput - The return type for the simplifyIndianLaw function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {z} from 'genkit';

const SimplifyIndianLawInputSchema = z.object({
  topic: z.string().describe('The Indian law, act, or rule to be explained.'),
  targetLanguage: z
    .enum(['en', 'hi'])
    .describe('The target language for the explanation (en for English, hi for Hindi).'),
});
export type SimplifyIndianLawInput = z.infer<typeof SimplifyIndianLawInputSchema>;

const SimplifyIndianLawOutputSchema = z.object({
  explanation: z
    .string()
    .describe('The detailed explanation of the legal topic in the target language.'),
});
export type SimplifyIndianLawOutput = z.infer<typeof SimplifyIndianLawOutputSchema>;

export async function simplifyIndianLaw(input: SimplifyIndianLawInput): Promise<SimplifyIndianLawOutput> {
  return simplifyIndianLawFlow(input);
}

const simplifyIndianLawPrompt = ai.definePrompt({
  name: 'simplifyIndianLawPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: SimplifyIndianLawInputSchema},
  output: {schema: SimplifyIndianLawOutputSchema},
  prompt: `You are an expert in Indian law. Your task is to provide a fully detailed and comprehensive explanation of any Indian law, rule, or legal topic.

  Explain the following topic in the target language:

  Topic: {{{topic}}}
  Target Language: {{targetLanguage}}

  Your explanation must include the following details in a structured format:
  1.  **History and Purpose**: When and why the law was enacted.
  2.  **Timeline**: The effective dates of the law (from when to when it was active, if applicable).
  3.  **Amendments**: How many times it has been amended.
  4.  **Current Status**: What is the current status of the law (e.g., active, repealed, amended).
  5.  **Detailed Explanation**: A clear, comprehensive, and detailed explanation of the key aspects of the topic that is easy for a layperson to understand.
  
  If the target language is Hindi, use Devanagari script for the entire response.
  `,
});

const simplifyIndianLawFlow = ai.defineFlow(
  {
    name: 'simplifyIndianLawFlow',
    inputSchema: SimplifyIndianLawInputSchema,
    outputSchema: SimplifyIndianLawOutputSchema,
  },
  async input => {
    const {output} = await simplifyIndianLawPrompt(input);
    return output!;
  }
);
