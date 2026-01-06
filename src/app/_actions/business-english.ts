"use server";

import { NotionBusinessEnglishRepository } from "@/infrastructure/adapters/NotionBusinessEnglishRepository";
import { AddWordUseCase } from "@/core/use-cases/business-english/AddWordUseCase";
import { UpdateWordUseCase } from "@/core/use-cases/business-english/UpdateWordUseCase";
import { DeleteWordUseCase } from "@/core/use-cases/business-english/DeleteWordUseCase";
import { GetWordsUseCase } from "@/core/use-cases/business-english/GetWordsUseCase";
import { GetCategoriesUseCase } from "@/core/use-cases/business-english/GetCategoriesUseCase";
import {
  CreateWordParams,
  UpdateWordParams,
} from "@/core/domain/business-english-entities";

// Composition Root
const repo = new NotionBusinessEnglishRepository();
const addWordUseCase = new AddWordUseCase(repo);
const updateWordUseCase = new UpdateWordUseCase(repo);
const deleteWordUseCase = new DeleteWordUseCase(repo);
const getWordsUseCase = new GetWordsUseCase(repo);
const getCategoriesUseCase = new GetCategoriesUseCase(repo);

export async function addWordAction(params: CreateWordParams) {
  return await addWordUseCase.execute(params);
}

export async function updateWordAction(params: UpdateWordParams) {
  return await updateWordUseCase.execute(params);
}

export async function deleteWordAction(id: string) {
  return await deleteWordUseCase.execute(id);
}

export async function getWordsAction(cursor?: string, pageSize?: number) {
  return await getWordsUseCase.execute(cursor, pageSize);
}

export async function getCategoriesAction() {
  return await getCategoriesUseCase.execute();
}
