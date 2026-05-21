'use server';

/**
 * @fileOverview Creates personalized weekly workout and diet plans.
 *
 * - healthPlanner - The function that creates the health plan.
 * - HealthPlannerInput - The input type for the healthPlanner function.
 * - HealthPlannerOutput - The return type for the healthPlanner function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import {z} from 'genkit';

const HealthPlannerInputSchema = z.object({
  goal: z.enum(['Lose Weight', 'Build Muscle', 'Maintain Fitness']).describe('The primary fitness goal.'),
  fitnessLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']).describe('The user\'s current fitness level.'),
  dietaryPreference: z.enum(['Anything', 'Vegetarian', 'Vegan', 'Keto', 'Paleo']).describe('The user\'s dietary preference.'),
  allergies: z.string().optional().describe('A list of any food allergies.'),
  daysPerWeek: z.number().min(1).max(7).describe('The number of days the user can commit to working out.'),
  language: z.string().describe('The language for the response (e.g., "en" for English, "hi" for Hindi).'),
});
export type HealthPlannerInput = z.infer<typeof HealthPlannerInputSchema>;

const HealthPlannerOutputSchema = z.object({
  plan: z.string().describe('A detailed, long-form weekly workout and meal plan in Markdown format, including a summary and conclusion.'),
});
export type HealthPlannerOutput = z.infer<typeof HealthPlannerOutputSchema>;

export async function healthPlanner(input: HealthPlannerInput): Promise<HealthPlannerOutput> {
  return healthPlannerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'healthPlannerPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: HealthPlannerInputSchema},
  output: {schema: HealthPlannerOutputSchema},
  prompt: `You are an expert fitness coach and nutritionist. Create a comprehensive, personalized, and long-form weekly health plan based on the user's details.

  Generate the plan in the following language: {{language}}. If the language is 'hi', use Devanagari script.

  User Details:
  - Goal: {{{goal}}}
  - Current Fitness Level: {{fitnessLevel}}
  - Dietary Preference: {{dietaryPreference}}
  - Workout Days per Week: {{daysPerWeek}}
  {{#if allergies}}- Allergies/Restrictions: {{{allergies}}}{{/if}}

  Your task is to generate a complete 7-day plan.

  Workout Plan:
  - Provide a detailed workout for each of the {{daysPerWeek}} designated workout days.
  - For each workout, list specific exercises with sets, reps (or duration), and rest periods.
  - Tailor the exercises and intensity to the user's fitness level ({{fitnessLevel}}).
  - Include rest days.

  Meal Plan:
  - Provide a 7-day meal plan (Breakfast, Lunch, Dinner, and 2 Snacks) that aligns with the user's goal ({{goal}}) and dietary preference ({{dietaryPreference}}).
  - {{#if allergies}}Strictly avoid any ingredients related to the user's allergies: {{{allergies}}}.{{/if}}
  - Provide approximate portion sizes or calorie counts.
  - The meals should be balanced and nutritious.

  The generated plan should be a single string formatted in Markdown.
  Start with a brief summary of the plan. End with a concluding motivational message.
  Ensure the entire response is detailed, long-form, and easy to follow.
  `,
});

const healthPlannerFlow = ai.defineFlow(
  {
    name: 'healthPlannerFlow',
    inputSchema: HealthPlannerInputSchema,
    outputSchema: HealthPlannerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
