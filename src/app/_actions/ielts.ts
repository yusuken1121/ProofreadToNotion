"use server";

import { GeminiIELTSAdapter } from "@/infrastructure/adapters/GeminiIELTSAdapter";
import { NotionIELTSRepository } from "@/infrastructure/adapters/NotionIELTSRepository";
import { EvaluateEssayUseCase } from "@/core/use-cases/ielts/EvaluateEssayUseCase";
import { GenerateIELTSTaskUseCase } from "@/core/use-cases/ielts/GenerateIELTSTaskUseCase";
import { SyncIELTSSessionUseCase } from "@/core/use-cases/ielts/SyncIELTSSessionUseCase";
import { TaskType, IELTSAssessment } from "@/core/domain/ielts-entities";

// Composition Root
const aiGateway = new GeminiIELTSAdapter();
const repo = new NotionIELTSRepository();

const evaluateUseCase = new EvaluateEssayUseCase(aiGateway);
const generateUseCase = new GenerateIELTSTaskUseCase(aiGateway);
const syncUseCase = new SyncIELTSSessionUseCase(repo);

export async function generateProblemAction(taskType: TaskType) {
  return await generateUseCase.execute(taskType);
}

export async function evaluateEssayAction(essay: string, taskType: TaskType) {
  return await evaluateUseCase.execute(essay, taskType);
}

export async function syncSessionAction(
  essay: string,
  taskType: TaskType,
  assessment: IELTSAssessment
) {
  return await syncUseCase.execute(essay, taskType, assessment);
}
