export interface Paragraph {
  type: "paragraph";
  text: string;
}

export interface Heading {
  type: "heading";
  text: string;
  level: 1 | 2 | 3;
}

export interface BulletedListItem {
  type: "bulleted_list_item";
  text: string;
}

export type PageContent = Paragraph | Heading | BulletedListItem;

// フロントエンドに返すTOEIC問題アイテムの型定義
export interface ToeicQuestionItem {
  id: string;
  sentence: string;
  createdTime: string;
  lastEditedTime: string;
  completed: boolean; // できるようになった（チェックボックス）
  pageContent?: PageContent[];
}

// API レスポンスの型定義
export interface ApiResponse {
  success: boolean;
  data?: ToeicQuestionItem[];
  error?: string;
}

// チェックボックス更新リクエストの型定義
export interface CheckboxUpdateRequest {
  pageId: string;
  completed: boolean;
}
