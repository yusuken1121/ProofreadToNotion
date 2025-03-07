import { notion } from "@/config/backend/notion";
import { NextRequest, NextResponse } from "next/server";
import { CheckboxUpdateRequest } from "@/types/Toeic.Type";

export const POST = async (req: NextRequest) => {
  try {
    const { pageId, completed }: CheckboxUpdateRequest = await req.json();

    if (!pageId) {
      return NextResponse.json(
        { success: false, error: "ページIDが指定されていません。" },
        { status: 400 }
      );
    }

    // Notionのページを更新
    const response = await notion.pages.update({
      page_id: pageId,
      properties: {
        // できるようになった（チェックボックス）を更新
        できるようになった: {
          checkbox: completed,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: response.id,
        completed,
      },
    });
  } catch (error) {
    console.error("チェックボックス更新エラー:", error);
    return NextResponse.json(
      { success: false, error: "チェックボックスの更新に失敗しました。" },
      { status: 500 }
    );
  }
};
