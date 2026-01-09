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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shuffle } from "lucide-react";

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

  // Memorization Helper State
  const [isReverseMode, setIsReverseMode] = useState(false);

  const fetchWords = useCallback(async (startCursor: string | null) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/business-english?start_cursor=${startCursor || ""}&page_size=10`
      );
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
      const previousCursor =
        newPreviousCursors[newPreviousCursors.length - 1] || null;
      setPreviousCursors(newPreviousCursors);
      fetchWords(previousCursor);
      setCurrentPage(currentPage - 1);
    }
  };

  const handleShuffle = () => {
    setWords((prevWords) => {
      const shuffled = [...prevWords];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
    toast.success("単語をシャッフルしました");
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

      <section className="mb-12 flex flex-col sm:flex-row gap-6 justify-between items-start">
        <div className="flex-1 w-full">
          <h2 className="text-2xl font-semibold mb-4">新しいフレーズを登録</h2>
          <WordForm onWordAdded={() => fetchWords(null)} />
        </div>
        <div className="w-full sm:w-auto mt-8 sm:mt-0 p-6 bg-secondary/30 rounded-lg border border-border">
          <h3 className="text-xl font-semibold mb-2">Practice Mode</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Test your knowledge by typing the English translation for each
            phrase.
          </p>
          <Button
            className="w-full"
            onClick={() =>
              (window.location.href = "/business-english/practice")
            }
          >
            Start Writing Practice
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">フレーズカード</h2>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <CategoryFilter onCategoryChange={setSelectedCategory} />
          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="reverse-mode"
                checked={isReverseMode}
                onCheckedChange={setIsReverseMode}
              />
              <Label htmlFor="reverse-mode" className="cursor-pointer">
                Reverse Mode
              </Label>
            </div>
            <Button variant="outline" size="sm" onClick={handleShuffle}>
              <Shuffle className="w-4 h-4 mr-2" />
              Shuffle
            </Button>
          </div>
        </div>
        <FlashcardGrid
          words={filteredWords}
          isLoading={isLoading}
          error={error}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          isReverseMode={isReverseMode}
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
