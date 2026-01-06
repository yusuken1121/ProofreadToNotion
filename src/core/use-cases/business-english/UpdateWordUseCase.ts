import { IBusinessEnglishRepository } from "@/core/ports/business-english-ports";
import {
  UpdateWordParams,
  BusinessEnglishWord,
} from "@/core/domain/business-english-entities";

export class UpdateWordUseCase {
  constructor(private repo: IBusinessEnglishRepository) {}
  async execute(params: UpdateWordParams): Promise<BusinessEnglishWord> {
    return await this.repo.updateWord(params);
  }
}
