import { notion } from "@/config/backend/notion";
import { NOTION_DATABASE_TOEIC_ID } from "@/config/ENV";
import { NextRequest, NextResponse } from "next/server";
import { markdownToBlocks } from "@tryfabric/martian";
import { BlockObjectRequest } from "@notionhq/client/build/src/api-endpoints";

export const POST = async (req: NextRequest) => {
  try {
    const { sentence, description } = await req.json();
    if (!NOTION_DATABASE_TOEIC_ID) {
      return NextResponse.json(
        { error: "Databaseが設定されていません。" },
        { status: 500 }
      );
    }

    const createPageResponse = await notion.pages.create({
      parent: { database_id: NOTION_DATABASE_TOEIC_ID },
      properties: {
        文章: {
          type: "title",
          title: [
            {
              type: "text",
              text: { content: sentence },
            },
          ],
        },
      },
    });

    const pageId = createPageResponse.id;

    // markdownToBlocksはブロック配列を返すため、スプレッド構文で展開します

    const descriptionBlocks = markdownToBlocks(
      description
    ) as BlockObjectRequest[];

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

        ...descriptionBlocks,
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
