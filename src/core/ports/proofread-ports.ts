import { ProofreadRequest } from "@/core/domain/proofread-entities";

export interface IProofreadGateway {
  reviseText(request: ProofreadRequest): Promise<string>;
}
