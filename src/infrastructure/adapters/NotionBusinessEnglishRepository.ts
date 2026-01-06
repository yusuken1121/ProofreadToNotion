import { IBusinessEnglishRepository } from "@/core/ports/business-english-ports";
import {
  BusinessEnglishWord,
  PaginatedWords,
  CreateWordParams,
  UpdateWordParams,
} from "@/core/domain/business-english-entities";
import { notion } from "@/lib/notion";

const DATABASE_ID = process.env.NOTION_OFFSHORE_DATABASE_ID!;

type NotionPage = {
  id: string;
  properties: {
    Japanese: { title: { text: { content: string } }[] };
    English: { rich_text: { text: { content: string } }[] };
    Category: { select: { name: string } };
  };
};

export class NotionBusinessEnglishRepository implements IBusinessEnglishRepository {
  async getWords(
    cursor?: string,
    pageSize: number = 10
  ): Promise<PaginatedWords> {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      sorts: [{ property: "CreatedAt", direction: "descending" }],
      start_cursor: cursor || undefined,
      page_size: pageSize,
    });

    const responseTyped = response as unknown as {
      results: NotionPage[];
      next_cursor: string | null;
      has_more: boolean;
    };
    const words = responseTyped.results.map((page: NotionPage) => ({
      id: page.id,
      japanese: page.properties.Japanese.title[0]?.text.content || "",
      english: page.properties.English.rich_text[0]?.text.content || "",
      category: page.properties.Category?.select?.name || "",
    }));

    return {
      words,
      next_cursor: responseTyped.next_cursor,
      has_more: responseTyped.has_more,
    };
  }

  async createWord(params: CreateWordParams): Promise<BusinessEnglishWord> {
    const properties: any = {
      Japanese: { title: [{ text: { content: params.japanese } }] },
      English: { rich_text: [{ text: { content: params.english } }] },
      CreatedAt: { date: { start: new Date().toISOString() } },
    };

    if (params.category) {
      properties.Category = { select: { name: params.category } };
    }

    const response = await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties,
    });

    const page = response as unknown as NotionPage;
    return {
      id: page.id,
      japanese: params.japanese,
      english: params.english,
      category: params.category || "",
    };
  }

  async updateWord(params: UpdateWordParams): Promise<BusinessEnglishWord> {
    const properties: any = {
      Japanese: { title: [{ text: { content: params.japanese } }] },
      English: { rich_text: [{ text: { content: params.english } }] },
    };

    if (params.category) {
      properties.Category = { select: { name: params.category } };
    }

    await notion.pages.update({
      page_id: params.id,
      properties,
    });

    return {
      id: params.id,
      japanese: params.japanese,
      english: params.english,
      category: params.category || "",
    };
  }

  async deleteWord(id: string): Promise<void> {
    await notion.pages.update({
      page_id: id,
      archived: true,
    });
  }

  async getCategories(): Promise<string[]> {
    const response = await notion.databases.retrieve({
      database_id: DATABASE_ID,
    });
    // This is simplified; usually you'd inspect properties schema
    // Since Notion API doesn't return existing distinct values easily without iterating or schema inspection
    // For now, we assume schema inspection returns options.

    const properties = response.properties as any;
    if (
      properties.Category &&
      properties.Category.select &&
      properties.Category.select.options
    ) {
      return properties.Category.select.options.map((opt: any) => opt.name);
    }
    return [];
  }
}
