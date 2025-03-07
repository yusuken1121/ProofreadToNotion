import { notion } from "@/config/backend/notion";
import { NOTION_DATABASE_TOEIC_ID } from "@/config/ENV";
import { NextResponse } from "next/server";
import {
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { ApiResponse, ToeicQuestionItem } from "@/types/Toeic.Type";

interface ToeicQuestionProperties {
  文章: {
    id: string;
    type: "title";
    title: Array<RichTextItemResponse>;
  };
  // 他に必要なプロパティがあれば追加
}

// ページコンテンツの型を定義
interface PageContentBlock {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
}

export const GET = async (): Promise<NextResponse<ApiResponse>> => {
  try {
    if (!NOTION_DATABASE_TOEIC_ID) {
      return NextResponse.json(
        { success: false, error: "TOEIC Databaseが設定されていません。" },
        { status: 500 }
      );
    }

    // 全てのページを保存するための配列
    const allPages: PageObjectResponse[] = [];
    
    // NotionAPIから100件以上取得するためのページネーション処理
    let hasMore = true;
    let nextCursor: string | undefined = undefined;
    
    // 全てのデータを取得するまでループ
    while (hasMore) {
      const response = await notion.databases.query({
        database_id: NOTION_DATABASE_TOEIC_ID,
        sorts: [
          {
            timestamp: "created_time",
            direction: "descending", // 降順（新しい順）で取得
          },
        ],
        start_cursor: nextCursor,
        page_size: 100, // 一度に取得する最大数
      });
      
      // 結果を配列に追加
      allPages.push(...(response.results as PageObjectResponse[]));
      
      // 次のページがあるかチェック
      hasMore = response.has_more;
      nextCursor = response.next_cursor ?? undefined;
      
      // 無限ループ防止のセーフガード（必要に応じてコメントアウト）
      if (allPages.length > 1000) {
        console.warn('1000件以上のデータがあります。ページネーションを中断します。');
        hasMore = false;
      }
    }

    // 全てのページのページ詳細を取得
    const pagePromises = allPages.map(async (page) => {
      const typedPage = page as PageObjectResponse;
      
      // 型安全に properties にアクセスするためにキャスト
      const properties = typedPage.properties as unknown as ToeicQuestionProperties;
      const sentenceProperty = properties["文章"]?.title;
      const sentence = sentenceProperty?.length > 0 ? sentenceProperty[0]?.plain_text : "";

      // ページのブロック内容を取得
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let pageContent: PageContentBlock[] = [];
      try {
        const pageBlocks = await notion.blocks.children.list({
          block_id: typedPage.id,
        });

        // ページのブロックを整形
        pageContent = pageBlocks.results.map((block) => {
          // TypeScriptのエラーを回避するためにanyにキャスト
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const typedBlock = block as any;
          // ブロックの型に応じたデータ変換
          const blockType = typedBlock.type;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const content = typedBlock[blockType];

          return {
            type: blockType,
            content,
          };
        });
      } catch (err) {
        console.error(`ページID ${typedPage.id} のコンテンツ取得エラー:`, err);
        pageContent = []; // エラー時は空の配列を設定
      }

      return {
        id: typedPage.id,
        sentence,
        createdTime: typedPage.created_time,
        lastEditedTime: typedPage.last_edited_time,
        pageContent, // ページのコンテンツを追加
      } as ToeicQuestionItem;
    });

    // 全ページの処理を並行して実行
    const pages = await Promise.all(pagePromises);
    
    // 日付順（新しい順）に並び替え
    const sortedPages = pages.sort((a, b) => {
      return new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime();
    });

    return NextResponse.json({ success: true, data: sortedPages });
  } catch (error) {
    console.error("Notionからの取得エラー:", error);
    return NextResponse.json(
      { success: false, error: "Notionからのデータ取得に失敗しました。" },
      { status: 500 }
    );
  }
};
