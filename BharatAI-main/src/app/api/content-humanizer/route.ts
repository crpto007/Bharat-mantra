import { NextResponse } from "next/server";
import { deepseek } from "@/lib/deepseek";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt = `
You are an expert editor.

Rewrite the following text to sound natural,
human-like, engaging, and conversational.

Humanization Level:
${body.humanizeLevel}/100

Output Length:
${body.outputLength}

Language:
${body.language}

Instructions:
- Avoid robotic phrasing
- Improve readability
- Make writing more natural
- Keep meaning same
- Add human tone naturally

Original Text:
${body.text}
`;

    const response = await deepseek.chat.completions.create({
      model: "deepseek/meta-llama/llama-3.3-70b-instruct:free-v3-0324",

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.8,
    });

    return NextResponse.json({
      humanizedText:
        response.choices[0].message.content ||
        "No humanized text generated.",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        humanizedText:
          "AI service temporarily unavailable.",
      },
      {
        status: 500,
      }
    );
  }
}