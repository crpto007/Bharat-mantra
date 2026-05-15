import { NextResponse } from "next/server";
import { deepseek } from "@/lib/deepseek";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt = `
You are an expert research assistant.

Generate a deep and detailed summary on this topic.

TOPIC:
${body.query}

LANGUAGE:
${body.language}

Instructions:
- Give overview
- Explain key insights
- Include important details
- Add conclusion
- Make response long and informative
- Do not include source URLs
`;

    const response =
      await deepseek.chat.completions.create({
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
      summary:
        response.choices[0].message.content ||
        "No summary generated.",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        summary:
          "AI service temporarily unavailable.",
      },
      {
        status: 500,
      }
    );
  }
}