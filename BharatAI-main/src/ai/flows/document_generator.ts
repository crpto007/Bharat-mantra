'use server';

/**
 * @fileOverview A flow to generate legal documents based on user-provided details.
 *
 * - documentGenerator - A function that handles the document generation process.
 * - DocumentGeneratorInput - The input type for the documentGenerator function.
 * - DocumentGeneratorOutput - The return type for the documentGenerator function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {z} from 'genkit';

const DocumentGeneratorInputSchema = z.object({
  docType: z.string().describe('The type of document to generate (e.g., "Non-Disclosure Agreement (NDA)").'),
  details: z.string().describe('The key details to include in the document, such as parties, dates, and terms.'),
  language: z.string().describe('The language for the response (e.g., "en" for English, "hi" for Hindi).'),
});
export type DocumentGeneratorInput = z.infer<typeof DocumentGeneratorInputSchema>;

const DocumentGeneratorOutputSchema = z.object({
  generatedDoc: z.string().describe('The fully generated, formatted legal document as a string.'),
});
export type DocumentGeneratorOutput = z.infer<typeof DocumentGeneratorOutputSchema>;

export async function documentGenerator(input: DocumentGeneratorInput): Promise<DocumentGeneratorOutput> {
  return documentGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'documentGeneratorPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: DocumentGeneratorInputSchema},
  output: {schema: DocumentGeneratorOutputSchema},
  prompt: `You are an AI assistant that specializes in generating formal legal documents.

  Generate a standard "{{docType}}" based on the following details:
  {{{details}}}

  Generate the document in the following language: {{language}}. If the language is 'hi', use Devanagari script.

  The "generatedDoc" must be a complete, fully detailed, and comprehensive document, formatted as a formal legal document, ready to be used.
  Do not include any conversational text or explanations in the document string.
  `,
});

const documentGeneratorFlow = ai.defineFlow(
  {
    name: 'documentGeneratorFlow',
    inputSchema: DocumentGeneratorInputSchema,
    outputSchema: DocumentGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
