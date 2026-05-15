import { NextResponse } from "next/server";
import { deepseek } from "@/lib/deepseek";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt = `
You are an AI assistant specialized in legal and formal documents.

Generate a professional and complete:

DOCUMENT TYPE:
${body.docType}

DOCUMENT DETAILS:
${body.details}

LANGUAGE:
${body.language}

Instructions:
- Create a fully detailed document
- Use proper formatting
- Make it professional
- No explanations outside document
- Ready for practical use
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

        temperature: 0.6,
      });

    return NextResponse.json({
      generatedDoc:
        response.choices[0].message.content ||
        "No document generated.",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        generatedDoc:
          "AI service temporarily unavailable.",
      },
      {
        status: 500,
      }
    );
  }
}