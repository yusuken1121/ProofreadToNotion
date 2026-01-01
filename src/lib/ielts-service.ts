import { notion } from "./notion";

// Environment variables for Database IDs
const WRITING_LOG_DB_ID = process.env.NOTION_WRITING_DB_ID!;
const WEAKNESS_TRACKER_DB_ID = process.env.NOTION_WEAKNESS_DB_ID!;
const VOCAB_BANK_DB_ID = process.env.NOTION_VOCAB_DB_ID!;

export interface IELTSSessionData {
  diaryEntry: string; // The essay content
  scores: {
    overall: number;
    TR: number;
    CC: number;
    LR: number;
    GRA: number;
  };
  taskType: "Task 1" | "Task 2";
  weaknessTags: string[];
  vocabulary: Array<{
    word: string;
    meaning: string;
    example: string;
  }>;
}

export class IELTSService {
  /**
   * Syncs the IELTS session data to Notion.
   * 1. Process Weakness Tags (Find or Create -> Get IDs)
   * 2. Create Writing Log Entry (linked to Weaknesses)
   * 3. Add Vocabulary to Smart Vocab Bank
   */
  async syncSession(data: IELTSSessionData) {
    // 1. Process Weakness Tags
    const weaknessRelationIds: string[] = [];

    for (const tag of data.weaknessTags) {
      const existing = await this.findWeaknessTag(tag);
      if (existing) {
        weaknessRelationIds.push(existing);
      } else {
        const newTagId = await this.createWeaknessTag(tag);
        if (newTagId) weaknessRelationIds.push(newTagId);
      }
    }

    // 2. Create Writing Log Entry
    const logResponse = await notion.pages.create({
      parent: { database_id: WRITING_LOG_DB_ID },
      properties: {
        Title: {
          title: [
            { text: { content: new Date().toISOString().split("T")[0] } }, // YYYY-MM-DD
          ],
        },
        Score: {
          number: data.scores.overall,
        },
        TR: { number: data.scores.TR },
        CC: { number: data.scores.CC },
        LR: { number: data.scores.LR },
        GRA: { number: data.scores.GRA },
        TaskType: {
          select: { name: data.taskType },
        },
        Weakness: {
          relation: weaknessRelationIds.map((id) => ({ id })),
        },
      },
      children: [
        {
          heading_2: {
            rich_text: [{ text: { content: "Essay" } }],
          },
        },
        {
          paragraph: {
            rich_text: [{ text: { content: data.diaryEntry } }],
          },
        },
        {
          heading_2: {
            rich_text: [{ text: { content: "Detailed Feedback" } }],
          },
        },
        // We could add more detailed feedback blocks here if passed in data
      ],
    });

    // 3. Add Vocabulary
    // Run in parallel to speed up
    await Promise.all(
      data.vocabulary.map(async (vocab) => {
        await notion.pages.create({
          parent: { database_id: VOCAB_BANK_DB_ID },
          properties: {
            Word: {
              title: [{ text: { content: vocab.word } }],
            },
            Meaning: {
              rich_text: [{ text: { content: vocab.meaning } }],
            },
            Example: {
              rich_text: [{ text: { content: vocab.example } }],
            },
            Status: {
              select: { name: "Learning" },
            },
            // Optional: Link back to the writing log if there's a relation property
          },
        });
      })
    );

    return logResponse;
  }

  private async findWeaknessTag(tagName: string): Promise<string | null> {
    try {
      const response = await notion.databases.query({
        database_id: WEAKNESS_TRACKER_DB_ID,
        filter: {
          property: "Name",
          title: {
            equals: tagName,
          },
        },
      });

      if (response.results.length > 0) {
        return response.results[0].id;
      }
      return null;
    } catch (e) {
      console.error(`Error searching for tag ${tagName}`, e);
      return null;
    }
  }

  private async createWeaknessTag(tagName: string): Promise<string | null> {
    try {
      const response = await notion.pages.create({
        parent: { database_id: WEAKNESS_TRACKER_DB_ID },
        properties: {
          Name: {
            title: [{ text: { content: tagName } }],
          },
          Category: {
            // Default category, maybe improve later to predict category
            select: { name: "General" },
          },
        },
      });
      return response.id;
    } catch (e) {
      console.error(`Error creating tag ${tagName}`, e);
      return null;
    }
  }
}

export const ieltsService = new IELTSService();
