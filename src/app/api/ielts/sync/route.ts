import { NextRequest, NextResponse } from "next/server";
import { ieltsService } from "@/lib/ielts-service";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();

    // Basic validation
    if (!data.diaryEntry || !data.scores || !data.weaknessTags) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Call the service to sync
    const result = await ieltsService.syncSession(data);

    return NextResponse.json(
      {
        message: "Successfully synced to Notion",
        pageId: result.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Notion Sync Error:", error);
    return NextResponse.json(
      { error: "Failed to sync with Notion." },
      { status: 500 }
    );
  }
};
