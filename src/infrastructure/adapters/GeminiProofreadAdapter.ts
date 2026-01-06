import { IProofreadGateway } from "@/core/ports/proofread-ports";
import { ProofreadRequest } from "@/core/domain/proofread-entities";
import { generateText } from "ai";
import { model } from "@/config/google";

export class GeminiProofreadAdapter implements IProofreadGateway {
  async reviseText(req: ProofreadRequest): Promise<string> {
    try {
      const prompt = `
以下のJSONデータに基づいて、英文を添削してください。

# 制約事項
- 出力はMarkdown形式で記述してください。
- 以下のセクションを含めてください：
  1. **修正後の英文**: 自然で、かつ指定された文体（${req.writingStyle}）に適した英文。
  2. **修正箇所の解説**: なぜ修正が必要だったのか、文法・語彙・ニュアンスの観点から簡潔に説明してください。特に、指定された誤りのレベル（${req.errorLevel}）と種類（${req.errorTypes}）に関係する点に注目してください。
  3. **改善のアドバイス**: より良い表現にするための具体的なヒント。

# 入力データ
---
英文: ${req.text}
文体: ${req.writingStyle}
誤りのレベル: ${req.errorLevel}
誤りの種類: ${req.errorTypes}
---
      `;

      const { text } = await generateText({
        model,
        prompt,
      });

      return text;
    } catch (error) {
      console.error("Gemini Proofread Error:", error);
      throw new Error("Failed to proofread text.");
    }
  }
}
