// コンテンツ表示用の型定義
export interface RichText {
  plain_text: string;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    code?: boolean;
  };
}

export interface ContentBlock {
  type: string;
  content?: {
    rich_text?: RichText[];
  };
}