import { IAIGateway } from "@/core/ports/ielts-ports";
import { TaskType } from "@/core/domain/ielts-entities";

export class GenerateIELTSTaskUseCase {
  constructor(private aiGateway: IAIGateway) {}

  async execute(taskType: TaskType): Promise<string> {
    return await this.aiGateway.generateProblem(taskType);
  }
}
