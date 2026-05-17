import { generateAIText } from "@/lib/deepseek";
import type { z } from "genkit";

type FlowConfig<Input, Output> = {
  name: string;
  inputSchema?: z.ZodType<Input>;
  outputSchema?: z.ZodType<Output>;
};

type FlowHandler<Input, Output> = (input: Input) => Promise<Output> | Output;

type GenerateOptions = {
  prompt: string;
  temperature?: number;
};

export const ai = {
  defineFlow<Input, Output>(
    config: FlowConfig<Input, Output>,
    handler: FlowHandler<Input, Output>,
  ) {
    const flow = async (input: Input) => {
      const parsedInput = config.inputSchema
        ? config.inputSchema.parse(input)
        : input;
      const output = await handler(parsedInput);

      return config.outputSchema ? config.outputSchema.parse(output) : output;
    };

    Object.defineProperty(flow, "name", {
      value: config.name,
    });

    return flow;
  },

  async generate({ prompt, temperature }: GenerateOptions) {
    const text = await generateAIText({
      prompt,
      temperature,
    });

    return { text };
  },
};
