'use server';
/**
 * @fileOverview Synthesizes multiple documents into a single coherent piece of content.
 *
 * - neuralWeaver - A function that handles the content synthesis process.
 * - NeuralWeaverInput - The input type for the neuralWeaver function.
 * - NeuralWeaverOutput - The return type for the neuralWeaver function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {z} from 'genkit';

const NeuralWeaverInputSchema = z.object({
  documents: z.array(z.string()).describe('An array of text documents to be synthesized.'),
  goal: z.string().describe('The user\'s goal for the final synthesized content (e.g., "a blog post", "a summary report").'),
  language: z.string().describe('The language for the response (e.g., "en" for English, "hi" for Hindi).'),
});
export type NeuralWeaverInput = z.infer<typeof NeuralWeaverInputSchema>;

const NeuralWeaverOutputSchema = z.object({
  synthesizedContent: z.string().describe('The final, synthesized content generated from the source documents.'),
});
export type NeuralWeaverOutput = z.infer<typeof NeuralWeaverOutputSchema>;

export async function neuralWeaver(input: NeuralWeaverInput): Promise<NeuralWeaverOutput> {
  return neuralWeaverFlow(input);
}

const prompt = ai.definePrompt({
  name: 'neuralWeaverPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: NeuralWeaverInputSchema},
  output: {schema: NeuralWeaverOutputSchema},
  prompt: `You are a master content synthesizer and editor, an expert at weaving disparate information into a seamless, insightful, and original narrative. Your task is to synthesize the provided source documents into a new, high-quality piece of content that achieves the user's specified goal.

  **CRITICAL INSTRUCTIONS:**
  1.  **Deep Synthesis, Not Just Summary:** Do not just summarize or rephrase each document. Your job is to find the connections, throughlines, and unique angles that emerge when these documents are considered together.
  2.  **Identify and Address Contradictions:** If the source documents conflict or present opposing viewpoints, do not ignore this. Highlight the discrepancies and offer a nuanced perspective on them.
  3.  **Structure for Clarity:** The final output must be exceptionally well-structured. Use Markdown for headings, subheadings, lists, and bold text to create a clear hierarchy and guide the reader. Start with an executive summary and end with a concluding paragraph.
  4.  **Adopt the Right Voice:** Your tone should match the user's goal. If the goal is "a blog post," be engaging and conversational. If it's "a summary report," be formal and objective.
  5.  **Go Beyond the Text:** While your primary information comes from the documents, use your own knowledge to fill in small gaps and add context to make the final piece more comprehensive and valuable.

  Generate the document in the following language: {{language}}. If the language is 'hi', use Devanagari script.
  
  **User's Goal:** {{{goal}}}

  **Source Documents:**
  {{#each documents}}
  --- Document Start ---
  {{{this}}}
  --- Document End ---
  {{/each}}
  `,
});

const neuralWeaverFlow = ai.defineFlow(
  {
    name: 'neuralWeaverFlow',
    inputSchema: NeuralWeaverInputSchema,
    outputSchema: NeuralWeaverOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
