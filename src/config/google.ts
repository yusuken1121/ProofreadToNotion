import { createGoogleGenerativeAI } from "@ai-sdk/google";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY が設定されていません。");
}

export const google = createGoogleGenerativeAI({
  apiKey: GEMINI_API_KEY,
});

export const model = google("gemini-2.5-flash-lite"); // Cost-effective for simple tasks
export const modelPro = google("gemini-2.5-flash-lite"); // High reasoning for complex feedback
