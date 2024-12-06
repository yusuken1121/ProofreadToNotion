import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import { DATABASE_ID, NOTION_API_KEY, NOTION_DATABASE_ID } from "@/config/ENV";

const notion = new Client({ auth: NOTION_API_KEY });
const databaseId = NOTION_DATABASE_ID;

export const POST = async (req: NextResponse, res: NextResponse) => {
  const response = await req.json();
  console.log(response);
  try {
    return NextResponse.json(
      { message: "データが正常に保存されました。" },
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
