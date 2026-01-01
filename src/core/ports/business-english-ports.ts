import {
  BusinessEnglishWord,
  PaginatedWords,
  CreateWordParams,
  UpdateWordParams,
} from "@/core/domain/business-english-entities";

export interface IBusinessEnglishRepository {
  getWords(cursor?: string, pageSize?: number): Promise<PaginatedWords>;
  createWord(params: CreateWordParams): Promise<BusinessEnglishWord>;
  updateWord(params: UpdateWordParams): Promise<BusinessEnglishWord>;
  deleteWord(id: string): Promise<void>;
  getCategories(): Promise<string[]>;
}
