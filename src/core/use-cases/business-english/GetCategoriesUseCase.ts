import { IBusinessEnglishRepository } from "@/core/ports/business-english-ports";

export class GetCategoriesUseCase {
  constructor(private repo: IBusinessEnglishRepository) {}
  async execute(): Promise<string[]> {
    return await this.repo.getCategories();
  }
}
