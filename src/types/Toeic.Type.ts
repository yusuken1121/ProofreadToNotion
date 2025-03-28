// フロントエンドに返すTOEIC問題アイテムの型定義
export interface ToeicQuestionItem {
  id: string;
  sentence: string;
  createdTime: string;
  lastEditedTime: string;
  completed: boolean; // できるようになった（チェックボックス）
  pageContent?: {
    type: string;
    content: any;
  }[];
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
