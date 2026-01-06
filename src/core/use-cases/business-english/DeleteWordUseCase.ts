import { IBusinessEnglishRepository } from "@/core/ports/business-english-ports";

export class DeleteWordUseCase {
  constructor(private repo: IBusinessEnglishRepository) {}
  async execute(id: string): Promise<void> {
    await this.repo.deleteWord(id);
  }
}
