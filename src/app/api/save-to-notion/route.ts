import { notion } from "@/config/backend/notion";
import { NOTION_DATABASE_ID } from "@/config/ENV";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const { proofreadText, originalText } = await req.json();
    if (!NOTION_DATABASE_ID) {
      return NextResponse.json(
        { error: "Databaseが設定されていません。" },
        { status: 500 }
      );
    }
    const createPageResponse = await notion.pages.create({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        Name: {
          type: "title",
          title: [
            {
              type: "text",
              text: { content: new Date().toLocaleString() },
            },
          ],
        },
        Formality: {
          select: {
            name: "formal",
          },
        },
      },
    });

    const pageId = createPageResponse.id;

    const addBlockResponse = await notion.blocks.children.append({
      block_id: pageId,
      children: [
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [
              { type: "text", text: { content: "オリジナルの文章" } },
            ],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: { content: originalText },
              },
            ],
          },
        },
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [{ type: "text", text: { content: "添削後の文章" } }],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: { content: proofreadText },
              },
            ],
          },
        },
      ],
    });
    return NextResponse.json({
      message: "ページが正常に作成され、ブロックが追加されました。",
      pageId: pageId,
      blocks: addBlockResponse.results,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "サーバーで予期せぬエラーが発生しました。",
      },
      { status: 500 }
    );
  }
};
