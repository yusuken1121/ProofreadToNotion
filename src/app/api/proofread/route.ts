import { NextRequest, NextResponse } from "next/server";

import { generateText } from "ai";
import { model } from "@/config/google";

export const POST = async (req: NextRequest) => {
  const { diaryEntry, writingStyle, errorLevel, errorTypes } = await req.json();
  const prompt = `
  以下のJSONデータに基づいて、英文を添削してください。
	•	訂正前の文章: ${diaryEntry}
	•	文体: ${writingStyle}
	•	誤りのレベル: ${errorLevel}
	•	誤りの種類: ${errorTypes}

出力形式:
	1.	訂正後の文章:
訂正された英文を記述してください。
	2.	訂正前の文章と解説:
	•	訂正前の文章: 訂正前の英文をそのまま記述してください。
	•	解説: 誤りの箇所を明記し、なぜそれが誤りなのかを簡潔に説明してください。
誤りの説明には、errorLevel（例: 文法、句レベルなど）に基づいた解説を加えてください。

フォーマット:
結果は必ず以下のようにMarkdown形式で記述してください。また、日本語で出力してください
### 訂正後の文章:
(ここに訂正後の英文を記述)

### 訂正前の文章と解説（フレーズごと）:
1. **訂正前:** (間違っているフレーズ)
   - **訂正後:** (訂正されたフレーズ)
   - **解説:** (誤りの理由、なぜその修正が適切か)
   
2. **訂正前:** (間違っているフレーズ)
   - **訂正後:** (訂正されたフレーズ)
   - **解説:** (誤りの理由、なぜその修正が適切か)

...(必要に応じて続けてください)
  `;

  try {
    const { text } = await generateText({ model, prompt });
    console.log(text);

    return NextResponse.json(
      { message: "データが正常に保存されました。", proofreadText: text },
      { status: 200 }
    );
  } catch (error) {
    console.error("サーバーエラー：", error);

    return NextResponse.json(
      {
        error: "サーバーで予期せぬエラーが発生しました。",
      },
      { status: 500 }
    );
  }
};
