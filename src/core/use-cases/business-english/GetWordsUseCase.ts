import { IBusinessEnglishRepository } from "@/core/ports/business-english-ports";
import { PaginatedWords } from "@/core/domain/business-english-entities";

export class GetWordsUseCase {
  constructor(private repo: IBusinessEnglishRepository) {}
  async execute(cursor?: string, pageSize?: number): Promise<PaginatedWords> {
    return await this.repo.getWords(cursor, pageSize);
  }
}
