export async function generateAI(prompt: string) {

  try {

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',

        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          model: 'deepseek/deepseek-chat',

          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],

          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    return data.choices?.[0]?.message?.content || 'No response';

  } catch (error) {

    console.error(error);

    return 'AI service error.';
  }
}