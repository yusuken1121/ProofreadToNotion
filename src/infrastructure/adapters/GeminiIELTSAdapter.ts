import { IAIGateway } from "@/core/ports/ielts-ports";
import { IELTSAssessment, TaskType } from "@/core/domain/ielts-entities";
import { generateText, generateObject } from "ai";
import { model, modelPro } from "@/config/google";
import { z } from "zod";

export class GeminiIELTSAdapter implements IAIGateway {
  async generateProblem(taskType: TaskType): Promise<string> {
    try {
      const prompt =
        taskType === "Task 1"
          ? "Generate a description for a sample IELTS Writing Task 1 visual (Bar Chart, Line Graph, Map, or Process). Describe the data/visual clearly so the student can write a report about it. Output ONLY the task description."
          : "Generate a challenging IELTS Writing Task 2 topic key question based on current trends (Technology, Environment, Education, Work, Globalization). Output ONLY the question text. Do not include instructions like 'Write at least 250 words'.";

      const { text } = await generateText({
        model, // Flash
        prompt,
        temperature: 1.0,
      });

      return text;
    } catch (error) {
      console.error("Gemini Generation Error:", error);
      throw new Error("Failed to generate IELTS problem.");
    }
  }

  async evaluateEssay(
    essay: string,
    taskType: TaskType
  ): Promise<IELTSAssessment> {
    try {
      const schema = z.object({
        overall_band: z.number(),
        criteria: z.object({
          TR: z.object({ score: z.number(), feedback: z.string() }),
          CC: z.object({ score: z.number(), feedback: z.string() }),
          LR: z.object({ score: z.number(), feedback: z.string() }),
          GRA: z.object({ score: z.number(), feedback: z.string() }),
        }),
        rewrite_suggestion: z.string(),
        weakness_tags: z.array(z.string()),
        key_vocabulary: z.array(
          z.object({
            word: z.string(),
            meaning: z.string(),
            example: z.string(),
          })
        ),
      });

      const systemPrompt = `
# Role
You represent a strict, senior IELTS Examiner and a strategic Language Mentor.

# Objective
Analyze the provided IELTS ${taskType} essay.
Output a strict JSON assessment focusing on the gap between current performance and Band 7.0+ requirements.

# Scoring Criteria (Apply these strictly)
1. Task Response (TR): Does it fully address all parts of the task? Is the position clear throughout?
2. Coherence and Cohesion (CC): Is there a logical progression? Are cohesive devices used naturally?
3. Lexical Resource (LR): Is there a wide range of vocabulary? Are there collocations used with valid precision?
4. Grammatical Range and Accuracy (GRA): Are complex structures used? Are sentences error-free?
      `;

      const { object } = await generateObject({
        model: modelPro, // Pro model
        schema: schema,
        system: systemPrompt,
        prompt: `Here is the student's essay:\n\n${essay}`,
      });

      return object as IELTSAssessment;
    } catch (error) {
      console.error("Gemini Evaluation Error:", error);
      throw new Error("Failed to evaluate IELTS essay.");
    }
  }
}
