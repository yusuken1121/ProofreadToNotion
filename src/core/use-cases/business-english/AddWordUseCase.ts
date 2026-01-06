import { IBusinessEnglishRepository } from "@/core/ports/business-english-ports";
import {
  CreateWordParams,
  BusinessEnglishWord,
} from "@/core/domain/business-english-entities";

export class AddWordUseCase {
  constructor(private repo: IBusinessEnglishRepository) {}
  async execute(params: CreateWordParams): Promise<BusinessEnglishWord> {
    return await this.repo.createWord(params);
  }
}
