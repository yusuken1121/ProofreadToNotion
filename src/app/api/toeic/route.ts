import { ERROR_MESSAGES } from "@/config/ERROR_MESSAGES";
import { model } from "@/config/google";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { sentence, description_type } = await req.json();
    const prompt = `
# TOEIC Reading Assistant

**Inputs:**
- **English sentence:** <${sentence}>
- **Explanation type:** <${description_type}> (either "vocabulary" or "grammar")

**Instructions:**
1. **Translation:** Provide a Japanese translation of the English sentence.
2. **Explanation:**
   - If **vocabulary**: Explain difficult words/phrases with extra example sentences.
   - If **grammar**: Explain the sentence structure and key grammar points with example sentences.
3. **Output:** Use Markdown and write the final answer in Japanese.

---

## Example

**Input:**
- English sentence: "The quick brown fox jumps over the lazy dog."
- Explanation type: "grammar"

**Output:**
expected output in markdown below
### 日本語訳
「その速い茶色のキツネは怠けた犬を飛び越える。」

### 文法解説
- **構造:** 主語 ("The quick brown fox")、述語 ("jumps over")、目的語 ("the lazy dog") で構成。
- **詳細:**
  - 主語は形容詞 "quick" と "brown" により修飾。
  - 述語は動詞 "jumps" と前置詞 "over" を含む。
  - 目的語は形容詞 "lazy" により修飾。
- **例文:**  
  - 主語例: "A clever fox finds a way."  
  - 前置詞例: "She walked over the bridge."

`;

    const { text, finishReason } = await generateText({ model, prompt });
    console.log(text, finishReason);
    return NextResponse.json(
      { message: "データが正常に保存されました。", description: text },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: ERROR_MESSAGES.ja.BACKEND.GENERAL.UNEXPECTED },
        { status: 500 }
      );
    }
  }
};
