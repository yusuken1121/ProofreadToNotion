import { IIELTSRepository } from "@/core/ports/ielts-ports";
import { IELTSSession } from "@/core/domain/ielts-entities";
import { notion } from "@/lib/notion";

// Environment variables
const WRITING_LOG_DB_ID = process.env.NOTION_WRITING_DB_ID!;
const WEAKNESS_TRACKER_DB_ID = process.env.NOTION_WEAKNESS_DB_ID!;
const VOCAB_BANK_DB_ID = process.env.NOTION_VOCAB_DB_ID!;

export class NotionIELTSRepository implements IIELTSRepository {
  async saveSession(session: IELTSSession): Promise<void> {
    try {
      // 1. Process Weakness Tags
      const weaknessRelationIds: string[] = [];
      for (const tag of session.assessment.weakness_tags) {
        const existing = await this.findWeaknessTag(tag);
        if (existing) {
          weaknessRelationIds.push(existing);
        } else {
          const newTagId = await this.createWeaknessTag(tag);
          if (newTagId) weaknessRelationIds.push(newTagId);
        }
      }

      // 2. Create Writing Log Entry
      await notion.pages.create({
        parent: { database_id: WRITING_LOG_DB_ID },
        properties: {
          Title: {
            title: [
              {
                text: {
                  content: session.createdAt.toISOString().split("T")[0],
                },
              },
            ],
          },
          Score: { number: session.assessment.overall_band },
          TR: { number: session.assessment.criteria.TR.score },
          CC: { number: session.assessment.criteria.CC.score },
          LR: { number: session.assessment.criteria.LR.score },
          GRA: { number: session.assessment.criteria.GRA.score },
          TaskType: { select: { name: session.taskType } },
          Weakness: {
            relation: weaknessRelationIds.map((id) => ({ id })),
          },
        },
        children: [
          { heading_2: { rich_text: [{ text: { content: "Essay" } }] } },
          { paragraph: { rich_text: [{ text: { content: session.essay } }] } },
          { heading_2: { rich_text: [{ text: { content: "Feedback" } }] } },
          // ... additional blocks if needed
        ],
      });

      // 3. Add Vocabulary
      await Promise.all(
        session.assessment.key_vocabulary.map(async (vocab) => {
          await notion.pages.create({
            parent: { database_id: VOCAB_BANK_DB_ID },
            properties: {
              Word: { title: [{ text: { content: vocab.word } }] },
              Meaning: { rich_text: [{ text: { content: vocab.meaning } }] },
              Example: { rich_text: [{ text: { content: vocab.example } }] },
              Status: { select: { name: "Learning" } },
            },
          });
        })
      );
    } catch (error) {
      console.error("Notion Save Error:", error);
      throw new Error("Failed to save session to Notion.");
    }
  }

  private async findWeaknessTag(tagName: string): Promise<string | null> {
    try {
      const response = await notion.databases.query({
        database_id: WEAKNESS_TRACKER_DB_ID,
        filter: {
          property: "Name",
          title: { equals: tagName },
        },
      });
      return response.results.length > 0 ? response.results[0].id : null;
    } catch (e) {
      return null;
    }
  }

  private async createWeaknessTag(tagName: string): Promise<string | null> {
    try {
      const response = await notion.pages.create({
        parent: { database_id: WEAKNESS_TRACKER_DB_ID },
        properties: {
          Name: { title: [{ text: { content: tagName } }] },
          Category: { select: { name: "General" } },
        },
      });
      return response.id;
    } catch (e) {
      return null;
    }
  }
}
