import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "NOTION_API_KEY is missing." },
      { status: 500 }
    );
  }

  const notion = new Client({ auth: apiKey });

  try {
    // Search for all databases the integration has access to
    const response = await notion.search({
      filter: {
        value: "database",
        property: "object",
      },
      page_size: 100,
    });

    return NextResponse.json(
      {
        message:
          "Connection test successful. Below are the databases this Integration can see.",
        count: response.results.length,
        accessible_databases: response.results.map((db: any) => ({
          id: db.id.replace(/-/g, ""), // Notion IDs usually strip hyphens in URLs but keeping them is fine too. API uses hyphens.
          id_formatted: db.id,
          title: db.title?.[0]?.plain_text || "Untitled",
          url: db.url,
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to connect to Notion.",
        details: error.message,
        code: error.code,
      },
      { status: 500 }
    );
  }
}
