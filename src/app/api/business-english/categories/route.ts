
import { notion } from "@/config/backend/notion";
import { NOTION_OFFSHORE_DATABASE_ID } from "@/config/ENV";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    if (!NOTION_OFFSHORE_DATABASE_ID) {
      return NextResponse.json(
        { error: "Notion Database IDが設定されていません。" },
        { status: 500 }
      );
    }

    const database = await notion.databases.retrieve({
      database_id: NOTION_OFFSHORE_DATABASE_ID,
    });

    const selectProperty = Object.values(database.properties).find(
      (property) => property.type === "select" && property.name === "Category"
    );

    if (!selectProperty || selectProperty.type !== "select") {
      return NextResponse.json(
        { error: "Categoryプロパティが見つかりません。" },
        { status: 404 }
      );
    }

    const categories = selectProperty.select.options.map((option) => option.name);

    return NextResponse.json(categories);
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
