"use server";

import { GeminiProofreadAdapter } from "@/infrastructure/adapters/GeminiProofreadAdapter";
import { ReviseTextUseCase } from "@/core/use-cases/proofread/ReviseTextUseCase";
import { ProofreadRequest } from "@/core/domain/proofread-entities";

// Composition Root
const gateway = new GeminiProofreadAdapter();
const reviseUseCase = new ReviseTextUseCase(gateway);

export async function reviseTextAction(request: ProofreadRequest) {
  return await reviseUseCase.execute(request);
}
