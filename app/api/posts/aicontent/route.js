import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Post from "@/models/post";
import { authMiddleware } from "@/middleware/auth";
// CREATE POST (AUTH REQUIRED)

import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

async function generateAiContent(title) {
  const response = await openai.chat.completions.create({
    model: "gemini-2.5-flash",
    messages: [
      {
        role: "system",
        content:
          "You are an expert AI prompt engineer who writes strict SYSTEM prompts.",
      },
      {
        role: "user",
        content: `
        generate  content on the following description or title given :{ ${title} } it must be like a blog or information about that  

        `,
      },
    ],
  });
  return response.choices[0].message.content?.trim();
}
export async function POST(req) {
  const auth = await authMiddleware(req);
  console.log(auth);
  if (!auth.authenticated) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();
  
    const {title}= body
     console.log(title)
    const content= await generateAiContent(title)
  
    return NextResponse.json({message:"Content generated Successfuly",content});
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
