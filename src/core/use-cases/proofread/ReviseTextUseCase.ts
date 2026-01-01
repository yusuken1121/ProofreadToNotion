import { IProofreadGateway } from "@/core/ports/proofread-ports";
import { ProofreadRequest } from "@/core/domain/proofread-entities";

export class ReviseTextUseCase {
  constructor(private gateway: IProofreadGateway) {}

  async execute(request: ProofreadRequest): Promise<string> {
    if (!request.text.trim()) {
      throw new Error("Text cannot be empty.");
    }
    return await this.gateway.reviseText(request);
  }
}
