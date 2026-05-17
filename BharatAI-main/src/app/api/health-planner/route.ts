import { NextResponse } from "next/server";
import { generateText } from "@/ai/flows/generate-text-flow";
import { createAIErrorResponse } from "@/lib/deepseek";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt = `
You are an expert fitness coach and nutritionist.

Create a personalized weekly workout and diet plan.

USER DETAILS:

Goal:
${body.goal}

Fitness Level:
${body.fitnessLevel}

Dietary Preference:
${body.dietaryPreference}

Workout Days Per Week:
${body.daysPerWeek}

Allergies:
${body.allergies || "None"}

Language:
${body.language}

INSTRUCTIONS:
- Create a detailed 7-day plan
- Include workout schedule
- Include meal plan
- Include sets and reps
- Include calories or portions
- Include motivation tips
- Make response professional
- Format cleanly in markdown
`;
    const text = await generateText({
      prompt,
      temperature: 0.7,
    });

    return NextResponse.json({
      plan: text || "No plan generated.",
    });
  } catch (error) {
    return createAIErrorResponse(error, {});
  }
}
