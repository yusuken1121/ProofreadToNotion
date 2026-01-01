import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";
import { modelPro } from "@/config/google";

// Define the schema for the output
const ieltsAssessmentSchema = z.object({
  overall_band: z
    .number()
    .describe("The overall band score, precise to 0.5 (e.g., 6.0, 6.5, 7.0)"),
  criteria: z.object({
    TR: z.object({
      score: z.number(),
      feedback: z
        .string()
        .describe(
          "Specific feedback citing essay parts. Explain why it is not an 8 yet."
        ),
    }),
    CC: z.object({
      score: z.number(),
      feedback: z.string().describe("Feedback on coherence and cohesion."),
    }),
    LR: z.object({
      score: z.number(),
      feedback: z.string().describe("Feedback on lexical resource."),
    }),
    GRA: z.object({
      score: z.number(),
      feedback: z
        .string()
        .describe("Feedback on grammatical range and accuracy."),
    }),
  }),
  rewrite_suggestion: z
    .string()
    .describe(
      "A rewritten version of the weakest paragraph that demonstrates Band 8.0 quality."
    ),
  weakness_tags: z
    .array(z.string())
    .describe(
      "3-5 specific, actionable tags representing frequent errors or weaknesses (e.g., 'Subject-Verb Agreement', 'Overuse of Passive Voice')."
    ),
  key_vocabulary: z
    .array(
      z.object({
        word: z.string(),
        meaning: z.string(),
        example: z.string(),
      })
    )
    .describe(
      "Important vocabulary extracted from the essay or better alternatives suggested."
    ),
});

export const POST = async (req: NextRequest) => {
  try {
    const { essay, taskType = "Task 2" } = await req.json();

    if (!essay) {
      return NextResponse.json(
        { error: "Essay content is required." },
        { status: 400 }
      );
    }

    const systemPrompt = `
# Role
You represent a strict, senior IELTS Examiner and a strategic Language Mentor. Your goal is to "debug" the student's writing to help them break through the Band 7.0 plateau.

# Objective
Analyze the provided IELTS ${taskType} essay.
Output a strict JSON assessment focusing on the gap between current performance and Band 7.0+ requirements.

# Scoring Criteria (Apply these strictly)
1. Task Response (TR): Does it fully address all parts of the task? Is the position clear throughout?
2. Coherence and Cohesion (CC): Is there a logical progression? Are cohesive devices used naturally (not mechanically)?
3. Lexical Resource (LR): Is there a wide range of vocabulary? Are there collocations used with valid precision?
4. Grammatical Range and Accuracy (GRA): Are complex structures used? Are sentences error-free?

# Tone Guidelines
- Be objective and quantitative.
- Do not sugarcoat. The user is an engineer who wants to fix bugs in their English.
- Focus on "High Impact" fixes that yield the biggest score increase.
    `;

    const { object } = await generateObject({
      model: modelPro,
      schema: ieltsAssessmentSchema,
      system: systemPrompt,
      prompt: `Here is the student's essay:\n\n${essay}`,
    });

    return NextResponse.json(object, { status: 200 });
  } catch (error) {
    console.error("IELTS Evaluation Error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate the essay." },
      { status: 500 }
    );
  }
};
