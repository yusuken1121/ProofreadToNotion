export interface BusinessEnglishWord {
  id: string;
  japanese: string;
  english: string;
  category: string;
}

export interface PaginatedWords {
  words: BusinessEnglishWord[];
  next_cursor: string | null;
  has_more: boolean;
}

export type CreateWordParams = {
  japanese: string;
  english: string;
  category?: string;
};

export type UpdateWordParams = {
  id: string;
  japanese: string;
  english: string;
  category?: string;
};
