import { notion } from "@/config/backend/notion";
import { NOTION_OFFSHORE_DATABASE_ID } from "@/config/ENV";
import { NextRequest, NextResponse } from "next/server";

// a type for the page object
type Page = {
  id: string;
  properties: {
    Japanese: {
      title: {
        text: {
          content: string;
        };
      }[];
    };
    English: {
      rich_text: {
        text: {
          content: string;
        };
      }[];
    };
    Category: {
      select: {
        name: string;
      };
    };
  };
};

type Properties = {
  Japanese: {
    title: {
      text: {
        content: string;
      };
    }[];
  };
  English: {
    rich_text: {
      text: {
        content: string;
      };
    }[];
  };
  CreatedAt?: {
    date: {
      start: string;
    };
  };
  Category?: {
    select: {
      name: string;
    };
  };
};

// 単語一覧を取得するAPI
export const GET = async (req: NextRequest) => {
  try {
    if (!NOTION_OFFSHORE_DATABASE_ID) {
      return NextResponse.json(
        { error: "Notion Database IDが設定されていません。" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const startCursor = searchParams.get("start_cursor") || undefined;
    const pageSize = Number(searchParams.get("page_size")) || 10;

    const response = await notion.databases.query({
      database_id: NOTION_OFFSHORE_DATABASE_ID,
      sorts: [
        {
          property: "CreatedAt",
          direction: "descending",
        },
      ],
      start_cursor: startCursor,
      page_size: pageSize,
    });

    const responseTyped = response as unknown as { results: Page[], next_cursor: string | null, has_more: boolean };
    const words = responseTyped.results.map((page: Page) => {
      return {
        id: page.id,
        japanese: page.properties.Japanese.title[0]?.text.content || "",
        english: page.properties.English.rich_text[0]?.text.content || "",
        category: page.properties.Category?.select?.name || "",
      };
    });

    return NextResponse.json({
      words,
      next_cursor: responseTyped.next_cursor,
      has_more: responseTyped.has_more,
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

// 新しい単語を追加するAPI
export const POST = async (req: NextRequest) => {
  try {
    const { japanese, english, category } = await req.json();

    if (!japanese || !english) {
      return NextResponse.json(
        { error: "日本語と英語の両方を入力してください。" },
        { status: 400 }
      );
    }

    if (!NOTION_OFFSHORE_DATABASE_ID) {
      return NextResponse.json(
        { error: "Notion Database IDが設定されていません。" },
        { status: 500 }
      );
    }

    const properties: Properties = {
      Japanese: {
        title: [
          {
            text: {
              content: japanese,
            },
          },
        ],
      },
      English: {
        rich_text: [
          {
            text: {
              content: english,
            },
          },
        ],
      },
      CreatedAt: {
        date: {
          start: new Date().toISOString(),
        },
      },
    };

    if (category) {
      properties.Category = {
        select: {
          name: category,
        },
      };
    }

    const response = await notion.pages.create({
      parent: { database_id: NOTION_OFFSHORE_DATABASE_ID },
      properties,
    });

    return NextResponse.json(response);
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

// 単語を更新するAPI
export const PUT = async (req: NextRequest) => {
  try {
    const { id, japanese, english, category } = await req.json();

    if (!id || !japanese || !english) {
      return NextResponse.json(
        { error: "ID、日本語、英語は必須です。" },
        { status: 400 }
      );
    }

    const properties: Omit<Properties, "CreatedAt"> = {
      Japanese: {
        title: [
          {
            text: {
              content: japanese,
            },
          },
        ],
      },
      English: {
        rich_text: [
          {
            text: {
              content: english,
            },
          },
        ],
      },
    };

    if (category) {
      properties.Category = {
        select: {
          name: category,
        },
      };
    }

    const response = await notion.pages.update({
      page_id: id,
      properties,
    });

    return NextResponse.json(response);
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

// 単語を削除するAPI
export const DELETE = async (req: NextRequest) => {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "IDは必須です。" }, { status: 400 });
    }

    const response = await notion.pages.update({
      page_id: id,
      archived: true,
    });

    return NextResponse.json(response);
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
