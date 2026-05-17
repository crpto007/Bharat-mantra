import { ai } from "@/ai/genkit";
import { z } from "genkit";

const GenerateTextInputSchema = z.object({
  prompt: z.string().min(1),
  temperature: z.number().min(0).max(2).optional(),
});

const GenerateTextOutputSchema = z.object({
  text: z.string(),
});

type GenerateTextInput = z.infer<typeof GenerateTextInputSchema>;

export const generateTextFlow = ai.defineFlow(
  {
    name: "generateTextFlow",
    inputSchema: GenerateTextInputSchema,
    outputSchema: GenerateTextOutputSchema,
  },
  async ({ prompt, temperature }: GenerateTextInput) => {
    const { text } = await ai.generate({
      prompt,
      temperature,
    });

    return { text };
  },
);

export async function generateText(input: GenerateTextInput) {
  const { text } = await generateTextFlow(input);

  return text;
}
