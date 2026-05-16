import { NextResponse } from "next/server";
import { deepseek } from "@/lib/deepseek";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt = `
You are an expert analyst.

Perform a deep detailed analysis.

Respond in this language: ${body.language}

Topic:
${body.query}
`;

    const response = await deepseek.chat.completions.create({
      model: "meta-llama/llama-3.3-70b-instruct:free",

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
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}