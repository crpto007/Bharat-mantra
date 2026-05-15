'use server';

/**
 * @fileOverview Creates presentation outlines, scripts, and image prompts.
 *
 * - presentationGuide - The function that creates the presentation content.
 * - PresentationGuideInput - The input type for the presentationGuide function.
 * - PresentationGuideOutput - The return type for the presentationGuide function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {z} from 'genkit';

const PresentationGuideInputSchema = z.object({
  topic: z.string().describe('The topic of the presentation.'),
  audience: z.string().describe('The target audience for the presentation.'),
  numberOfSlides: z.number().min(5).max(20).describe('The total number of slides for the presentation.'),
  language: z.string().describe('The language for the response (e.g., "en" for English, "hi" for Hindi).'),
});
export type PresentationGuideInput = z.infer<typeof PresentationGuideInputSchema>;

const PresentationGuideOutputSchema = z.object({
  outline: z.string().describe('A structured outline for the presentation, in Markdown format.'),
  script: z.string().describe('A detailed, long-form script for the presentation, in Markdown format, including a summary and conclusion.'),
  imagePrompts: z.array(z.string()).describe('A list of descriptive prompts for a text-to-image model, with one prompt for every two slides.'),
});
export type PresentationGuideOutput = z.infer<typeof PresentationGuideOutputSchema>;

export async function presentationGuide(input: PresentationGuideInput): Promise<PresentationGuideOutput> {
  return presentationGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'presentationGuidePrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: PresentationGuideInputSchema},
  output: {schema: PresentationGuideOutputSchema},
  prompt: `You are an expert presentation coach. Create a detailed presentation outline, a full script, and a series of image prompts for the given topic.

  Generate the content in the following language: {{language}}. If the language is 'hi', use Devanagari script.

  Topic: {{{topic}}}
  Target Audience: {{{audience}}}
  Number of Slides: {{numberOfSlides}}

  1.  **Outline**: Create a structured and detailed outline for a {{numberOfSlides}}-slide presentation. Include clear sections (e.g., Introduction, Main Points, Conclusion). The outline must be tailored to the specified topic and target audience.
  2.  **Script**: Write a complete, engaging, and long-form script based on that outline. Adopt the most appropriate tone based on the topic and the target audience ({{{audience}}}). The script must include a detailed summary of the key points and a strong concluding statement. Format this as Markdown.
  3.  **Image Prompts**: Generate a list of descriptive, high-quality prompts for a text-to-image AI model. Create one image prompt for every two slides. For example, if there are 10 slides, you should generate 5 image prompts. Each prompt should be a detailed sentence describing a visual that complements the content of the corresponding slides.
  `,
});

const presentationGuideFlow = ai.defineFlow(
  {
    name: 'presentationGuideFlow',
    inputSchema: PresentationGuideInputSchema,
    outputSchema: PresentationGuideOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
