import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export async function generateAiContent(title) {
  const response = await openai.chat.completions.create({
    model: "gemini-2.5-flash",
    messages: [
      {
        role: "system",
        content: `
You are a professional content writer.
You MUST return plain text only.

Rules:
- Do NOT use markdown
- Do NOT use headings (no ##, ###)
- Do NOT use bullet points or numbering
- Do NOT use bold, italics, or symbols
- Write in clear paragraphs like a blog article
        `.trim(),
      },
      {
        role: "user",
        content: `
Generate informative blog-style content based on the following title or description:
${title}
        `.trim(),
      },
    ],
  });

  return response.choices[0].message.content?.trim();
}
