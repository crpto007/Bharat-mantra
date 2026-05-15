import { NextResponse } from "next/server";
import { deepseek } from "@/lib/deepseek";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt = `
You are an expert analyst.

Perform a deep, detailed, multi-step analysis of the following topic.

Provide:
- Overview
- Key insights
- Detailed explanation
- Final conclusion

Respond in this language: ${body.language}

Topic:
${body.query}
`;

    const response = await deepseek.chat.completions.create({
      model: "deepseek/meta-llama/llama-3.3-70b-instruct:free-v3-0324",

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.7,
    });

    return NextResponse.json({
      analysis:
        response.choices[0].message.content ||
        "No analysis generated.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        analysis: "AI service temporarily unavailable.",
      },
      {
        status: 500,
      }
    );
  }
}