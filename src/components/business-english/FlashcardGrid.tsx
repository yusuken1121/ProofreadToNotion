
'use client';

import { BusinessEnglishWord } from '@/types/BusinessEnglish.Type';
import Flashcard from './Flashcard';
import { Skeleton } from '@/components/ui/skeleton';

interface FlashcardGridProps {
  words: BusinessEnglishWord[];
  isLoading: boolean;
  error: string | null;
  onEdit: (word: BusinessEnglishWord) => void;
  onDelete: (wordId: string) => void;
}

const FlashcardGrid = ({ words, isLoading, error, onEdit, onDelete }: FlashcardGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-48" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">エラー: {error}</p>;
  }

  if (words.length === 0) {
    return <p>登録されている単語はありません。</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {words.map((word) => (
        <Flashcard key={word.id} word={word} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default FlashcardGrid;
