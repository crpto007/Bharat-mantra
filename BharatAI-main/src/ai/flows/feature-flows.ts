import { ai } from "@/ai/genkit";
import { z } from "genkit";

const TextOutputSchema = z.object({
  text: z.string(),
});

const AdvancedAnalysisInputSchema = z.object({
  query: z.string().min(1),
  language: z.string().default("en"),
});

const ChatbotInputSchema = z.object({
  message: z.string().min(1),
  language: z.string().default("en"),
  context: z.string().optional(),
});

const CognitiveCanvasInputSchema = z.object({
  rawText: z.string().min(1),
  language: z.string().default("en"),
});

const CognitiveCanvasOutputSchema = z.object({
  organizedContent: z.string(),
  suggestions: z.string(),
});

const ContentHumanizerInputSchema = z.object({
  text: z.string().min(1),
  humanizeLevel: z.union([z.string(), z.number()]).default(70),
  outputLength: z.string().default("medium"),
  language: z.string().default("en"),
});

const DocumentGeneratorInputSchema = z.object({
  docType: z.string().min(1),
  details: z.string().min(1),
  language: z.string().default("en"),
});

const GroundedSearchInputSchema = z.object({
  query: z.string().min(1),
  language: z.string().default("en"),
});

const HealthPlannerInputSchema = z.object({
  goal: z.string().min(1),
  fitnessLevel: z.string().min(1),
  dietaryPreference: z.string().min(1),
  daysPerWeek: z.union([z.string(), z.number()]),
  allergies: z.string().optional(),
  language: z.string().default("en"),
});

const LawExplainerInputSchema = z.object({
  topic: z.string().min(1),
  targetLanguage: z.string().default("en"),
});

const NeuralWeaverInputSchema = z.object({
  goal: z.string().min(1),
  language: z.string().default("en"),
  documents: z.array(z.string().min(1)).min(1),
});

const PresentationGuideInputSchema = z.object({
  topic: z.string().min(1),
  audience: z.string().min(1),
  numberOfSlides: z.union([z.string(), z.number()]),
  language: z.string().default("en"),
});

const PresentationGuideOutputSchema = z.object({
  outline: z.string(),
  script: z.string(),
  imagePrompts: z.array(z.string()),
});

const PromptEnhancerInputSchema = z.object({
  prompt: z.string().min(1),
  language: z.string().default("en"),
});

function splitCognitiveCanvas(text: string) {
  const parts = text.split("SUGGESTIONS:");

  return {
    organizedContent:
      parts[0]?.replace("ORGANIZED CONTENT:", "").trim() ||
      "No organized content generated.",
    suggestions: parts[1]?.trim() || "No suggestions generated.",
  };
}

function splitPresentationGuide(text: string) {
  const outlineMatch = text.match(/OUTLINE:([\s\S]*?)SCRIPT:/);
  const scriptMatch = text.match(/SCRIPT:([\s\S]*?)IMAGE PROMPTS:/);
  const promptsMatch = text.match(/IMAGE PROMPTS:([\s\S]*)/);
  const imagePrompts =
    promptsMatch?.[1]
      ?.split("\n")
      .filter((prompt: string) => prompt.trim())
      .map((prompt: string) => prompt.replace(/^\d+\.\s*/, "").trim()) || [];

  return {
    outline: outlineMatch?.[1]?.trim() || "No outline generated.",
    script: scriptMatch?.[1]?.trim() || "No script generated.",
    imagePrompts,
  };
}

export const advancedAnalysisFlow = ai.defineFlow(
  {
    name: "advancedAnalysisFlow",
    inputSchema: AdvancedAnalysisInputSchema,
    outputSchema: TextOutputSchema,
  },
  async ({ query, language }) => {
    const { text } = await ai.generate({
      prompt: `
You are an expert analyst.

Perform a deep detailed analysis.

Respond in this language: ${language}

Topic:
${query}
`,
      temperature: 0.7,
    });

    return { text: text || "No analysis generated." };
  },
);

export const chatbotFlow = ai.defineFlow(
  {
    name: "chatbotFlow",
    inputSchema: ChatbotInputSchema,
    outputSchema: TextOutputSchema,
  },
  async ({ message, language, context }) => {
    const { text } = await ai.generate({
      prompt: `
You are BharatAI, a helpful multilingual AI assistant.

Language: ${language}

Previous conversation:
${context || "No previous context"}

User message:
${message}
`,
    });

    return { text: text || "No response generated." };
  },
);

export const cognitiveCanvasFlow = ai.defineFlow(
  {
    name: "cognitiveCanvasFlow",
    inputSchema: CognitiveCanvasInputSchema,
    outputSchema: CognitiveCanvasOutputSchema,
  },
  async ({ rawText, language }) => {
    const { text } = await ai.generate({
      prompt: `
You are an expert AI brainstorming facilitator.

Your task:

1. Organize the user's raw ideas into a clean structured outline.
2. Suggest new ideas and improvements.

Respond in ${language} language.

User Notes:
${rawText}

Return format:

ORGANIZED CONTENT:
...

SUGGESTIONS:
...
`,
      temperature: 0.7,
    });

    return splitCognitiveCanvas(text || "");
  },
);

export const contentHumanizerFlow = ai.defineFlow(
  {
    name: "contentHumanizerFlow",
    inputSchema: ContentHumanizerInputSchema,
    outputSchema: TextOutputSchema,
  },
  async ({ text: originalText, humanizeLevel, outputLength, language }) => {
    const { text } = await ai.generate({
      prompt: `
You are an expert editor.

Rewrite the following text to sound natural,
human-like, engaging, and conversational.

Humanization Level:
${humanizeLevel}/100

Output Length:
${outputLength}

Language:
${language}

Instructions:
- Avoid robotic phrasing
- Improve readability
- Make writing more natural
- Keep meaning same
- Add human tone naturally

Original Text:
${originalText}
`,
      temperature: 0.8,
    });

    return { text: text || "No humanized text generated." };
  },
);

export const documentGeneratorFlow = ai.defineFlow(
  {
    name: "documentGeneratorFlow",
    inputSchema: DocumentGeneratorInputSchema,
    outputSchema: TextOutputSchema,
  },
  async ({ docType, details, language }) => {
    const { text } = await ai.generate({
      prompt: `
You are an AI assistant specialized in legal and formal documents.

Generate a professional and complete:

DOCUMENT TYPE:
${docType}

DOCUMENT DETAILS:
${details}

LANGUAGE:
${language}

Instructions:
- Create a fully detailed document
- Use proper formatting
- Make it professional
- No explanations outside document
- Ready for practical use
`,
      temperature: 0.6,
    });

    return { text: text || "No document generated." };
  },
);

export const groundedSearchFlow = ai.defineFlow(
  {
    name: "groundedSearchFlow",
    inputSchema: GroundedSearchInputSchema,
    outputSchema: TextOutputSchema,
  },
  async ({ query, language }) => {
    const { text } = await ai.generate({
      prompt: `
You are an expert research assistant.

Generate a deep and detailed summary on this topic.

TOPIC:
${query}

LANGUAGE:
${language}

Instructions:
- Give overview
- Explain key insights
- Include important details
- Add conclusion
- Make response long and informative
- Do not include source URLs
`,
      temperature: 0.7,
    });

    return { text: text || "No summary generated." };
  },
);

export const healthPlannerFlow = ai.defineFlow(
  {
    name: "healthPlannerFlow",
    inputSchema: HealthPlannerInputSchema,
    outputSchema: TextOutputSchema,
  },
  async ({
    goal,
    fitnessLevel,
    dietaryPreference,
    daysPerWeek,
    allergies,
    language,
  }) => {
    const { text } = await ai.generate({
      prompt: `
You are an expert fitness coach and nutritionist.

Create a personalized weekly workout and diet plan.

USER DETAILS:

Goal:
${goal}

Fitness Level:
${fitnessLevel}

Dietary Preference:
${dietaryPreference}

Workout Days Per Week:
${daysPerWeek}

Allergies:
${allergies || "None"}

Language:
${language}

INSTRUCTIONS:
- Create a detailed 7-day plan
- Include workout schedule
- Include meal plan
- Include sets and reps
- Include calories or portions
- Include motivation tips
- Make response professional
- Format cleanly in markdown
`,
      temperature: 0.7,
    });

    return { text: text || "No plan generated." };
  },
);

export const lawExplainerFlow = ai.defineFlow(
  {
    name: "lawExplainerFlow",
    inputSchema: LawExplainerInputSchema,
    outputSchema: TextOutputSchema,
  },
  async ({ topic, targetLanguage }) => {
    const { text } = await ai.generate({
      prompt: `
You are an expert Indian legal advisor.

Explain this Indian law / act / section in detail.

LAW TOPIC:
${topic}

TARGET LANGUAGE:
${targetLanguage}

INSTRUCTIONS:
- Explain in simple language
- Include history and purpose
- Include timeline
- Include amendments
- Include current legal status
- Include important sections
- Make it beginner friendly
- Use detailed explanation
- Use Hindi if requested
`,
      temperature: 0.6,
    });

    return { text: text || "No explanation generated." };
  },
);

export const neuralWeaverFlow = ai.defineFlow(
  {
    name: "neuralWeaverFlow",
    inputSchema: NeuralWeaverInputSchema,
    outputSchema: TextOutputSchema,
  },
  async ({ documents, goal, language }) => {
    const documentsText = documents
      .map((doc: string, index: number) => `DOCUMENT ${index + 1}:\n${doc}`)
      .join("\n\n");

    const { text } = await ai.generate({
      prompt: `
You are a master content synthesizer and editor.

Your task is to combine multiple documents
into one highly polished final content.

USER GOAL:
${goal}

LANGUAGE:
${language}

SOURCE DOCUMENTS:
${documentsText}

IMPORTANT INSTRUCTIONS:
- Do deep synthesis
- Find connections between documents
- Resolve contradictions intelligently
- Make output highly structured
- Use markdown formatting
- Add headings and sections
- Create professional final content
- Match tone according to goal
- Add conclusion at end
`,
      temperature: 0.7,
    });

    return { text: text || "No content generated." };
  },
);

export const presentationGuideFlow = ai.defineFlow(
  {
    name: "presentationGuideFlow",
    inputSchema: PresentationGuideInputSchema,
    outputSchema: PresentationGuideOutputSchema,
  },
  async ({ topic, audience, numberOfSlides, language }) => {
    const { text } = await ai.generate({
      prompt: `
You are an expert presentation coach.

Create:
1. Presentation Outline
2. Full Presentation Script
3. AI Image Prompts

TOPIC:
${topic}

TARGET AUDIENCE:
${audience}

NUMBER OF SLIDES:
${numberOfSlides}

LANGUAGE:
${language}

IMPORTANT:
- Use markdown formatting
- Make outline structured
- Make script detailed
- Create engaging presentation
- Generate one image prompt for every 2 slides

FORMAT RESPONSE EXACTLY LIKE THIS:

OUTLINE:
...

SCRIPT:
...

IMAGE PROMPTS:
1.
2.
3.
`,
      temperature: 0.7,
    });

    return splitPresentationGuide(text || "");
  },
);

export const promptEnhancerFlow = ai.defineFlow(
  {
    name: "promptEnhancerFlow",
    inputSchema: PromptEnhancerInputSchema,
    outputSchema: TextOutputSchema,
  },
  async ({ prompt, language }) => {
    const { text } = await ai.generate({
      prompt: `
You are an expert AI prompt engineer.

Your task:
Rewrite the user's prompt to make it:
- clearer
- more specific
- highly effective
- optimized for AI systems
- concise but powerful

LANGUAGE:
${language}

ORIGINAL PROMPT:
${prompt}

IMPORTANT:
- Understand user intent deeply
- Add missing context if needed
- Improve clarity
- Improve output quality
- Keep it professional
- Return ONLY the enhanced prompt
`,
      temperature: 0.7,
    });

    return { text: text || "No enhanced prompt generated." };
  },
);
