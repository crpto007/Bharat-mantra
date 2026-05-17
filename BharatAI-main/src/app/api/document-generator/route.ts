import { NextResponse } from "next/server";
import { generateAIText, getAIErrorMessage } from "@/lib/deepseek";

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

<<<<<<< HEAD
    const text = await generateAIText(prompt, { temperature: 0.6 });

    return NextResponse.json({
      generatedDoc: text || "No document generated.",
=======
    const text = await generateAIText(prompt, {
      temperature: 0.6,
    });

    return NextResponse.json({
      generatedDoc: text,
>>>>>>> main
    });
  } catch (error) {
    console.error(error);

    const message = getAIErrorMessage(error);

    return NextResponse.json(
      {
<<<<<<< HEAD
        error: message,
        generatedDoc: message,
=======
        generatedDoc: getAIErrorMessage(error),
>>>>>>> main
      },
      {
        status: 500,
      },
    );
  }
}
