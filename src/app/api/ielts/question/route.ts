import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { model } from "@/config/google";

export const POST = async (req: NextRequest) => {
  try {
    const { taskType } = await req.json(); // "Task 1" or "Task 2"

    const prompt =
      taskType === "Task 1"
        ? "Generate a description for a sample IELTS Writing Task 1 visual (Bar Chart, Line Graph, Map, or Process). Describe the data/visual clearly so the student can write a report about it. Output ONLY the task description."
        : "Generate a challenging IELTS Writing Task 2 topic key question based on current trends (Technology, Environment, Education, Work, Globalization). Output ONLY the question text. Do not include instructions like 'Write at least 250 words'.";

    const { text } = await generateText({
      model,
      prompt,
      temperature: 1.0, // High variety
    });

    return NextResponse.json({ question: text });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
};
