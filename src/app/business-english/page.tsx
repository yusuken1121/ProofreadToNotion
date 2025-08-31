"use client";
import WordForm from "@/components/business-english/WordForm";
import FlashcardGrid from "@/components/business-english/FlashcardGrid";
import { useState, useEffect, useCallback } from "react";
import { BusinessEnglishWord } from "@/types/BusinessEnglish.Type";
import EditWordModal from "@/components/business-english/EditWordModal";
import DeleteConfirmationDialog from "@/components/business-english/DeleteConfirmationDialog";
import { toast } from "sonner";
import CategoryFilter from "@/components/business-english/CategoryFilter";
import { Button } from "@/components/ui/button";

export default function BusinessEnglishPage() {
  const [words, setWords] = useState<BusinessEnglishWord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [previousCursors, setPreviousCursors] = useState<(string | null)[]>([]);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<BusinessEnglishWord | null>(
    null
  );

  // Delete Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [wordIdToDelete, setWordIdToDelete] = useState<string | null>(null);

  const fetchWords = useCallback(async (startCursor: string | null) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/business-english?start_cursor=${startCursor || ''}&page_size=10`);
      if (!response.ok) {
        throw new Error("単語の取得に失敗しました。");
      }
      const data = await response.json();
      setWords(data.words);
      setNextCursor(data.next_cursor);
      setHasMore(data.has_more);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWords(null);
  }, [fetchWords]);

  // --- Handlers ---
  const handleEditClick = (word: BusinessEnglishWord) => {
    setSelectedWord(word);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (wordId: string) => {
    setWordIdToDelete(wordId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!wordIdToDelete) return;
    try {
      const response = await fetch("/api/business-english", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: wordIdToDelete }),
      });

      if (!response.ok) {
        throw new Error("単語の削除に失敗しました。");
      }

      toast.success("単語を削除しました。");
      fetchWords(null); // Refresh list
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("予期せぬエラーが発生しました。");
      }
    } finally {
      setIsDeleteDialogOpen(false);
      setWordIdToDelete(null);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setPreviousCursors([...previousCursors, nextCursor]);
      fetchWords(nextCursor);
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPreviousCursors = [...previousCursors];
      newPreviousCursors.pop();
      const previousCursor = newPreviousCursors[newPreviousCursors.length - 1] || null;
      setPreviousCursors(newPreviousCursors);
      fetchWords(previousCursor);
      setCurrentPage(currentPage - 1);
    }
  };

  const filteredWords = words.filter((word) => {
    if (selectedCategory === "all") {
      return true;
    }
    return word.category === selectedCategory;
  });

  return (
    <>
      <h1 className="text-3xl font-bold my-6">ビジネス英語 単語帳</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">新しいフレーズを登録</h2>
        <WordForm onWordAdded={() => fetchWords(null)} />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">フレーズカード</h2>
        <CategoryFilter onCategoryChange={setSelectedCategory} />
        <FlashcardGrid
          words={filteredWords}
          isLoading={isLoading}
          error={error}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
        <div className="flex justify-center items-center space-x-4 mt-4">
          <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <span>Page {currentPage}</span>
          <Button onClick={handleNextPage} disabled={!hasMore}>
            Next
          </Button>
        </div>
      </section>

      <EditWordModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        word={selectedWord}
        onWordUpdated={() => fetchWords(null)}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
