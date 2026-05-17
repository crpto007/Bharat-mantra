import { NextResponse } from "next/server";
import { generateAIText, getAIErrorMessage } from "@/lib/deepseek";

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

    const text = await generateAIText(prompt, { temperature: 0.8 });

    return NextResponse.json({
      humanizedText: text || "No humanized text generated.",
    });
  } catch (error) {
    console.error(error);

    const message = getAIErrorMessage(error);

    return NextResponse.json(
      {
        error: message,
        humanizedText: message,
      },
      {
        status: 500,
      },
    );
  }
}
