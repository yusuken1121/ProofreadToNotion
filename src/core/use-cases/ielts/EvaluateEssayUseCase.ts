import { IAIGateway } from "@/core/ports/ielts-ports";
import { IELTSAssessment, TaskType } from "@/core/domain/ielts-entities";

export class EvaluateEssayUseCase {
  constructor(private aiGateway: IAIGateway) {}

  async execute(essay: string, taskType: TaskType): Promise<IELTSAssessment> {
    if (!essay.trim()) {
      throw new Error("Essay content cannot be empty.");
    }
    return await this.aiGateway.evaluateEssay(essay, taskType);
  }
}
