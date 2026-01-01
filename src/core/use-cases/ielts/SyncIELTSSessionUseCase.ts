import { IIELTSRepository } from "@/core/ports/ielts-ports";
import { IELTSAssessment, TaskType } from "@/core/domain/ielts-entities";

export class SyncIELTSSessionUseCase {
  constructor(private repo: IIELTSRepository) {}

  async execute(
    essay: string,
    taskType: TaskType,
    assessment: IELTSAssessment
  ): Promise<void> {
    await this.repo.saveSession({
      essay,
      taskType,
      assessment,
      createdAt: new Date(),
    });
  }
}
