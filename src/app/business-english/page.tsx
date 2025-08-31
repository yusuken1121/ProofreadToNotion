"use client";
import WordForm from "@/components/business-english/WordForm";
import FlashcardGrid from "@/components/business-english/FlashcardGrid";
import { useState, useEffect, useCallback } from "react";
import { BusinessEnglishWord } from "@/types/BusinessEnglish.Type";
import EditWordModal from "@/components/business-english/EditWordModal";
import DeleteConfirmationDialog from "@/components/business-english/DeleteConfirmationDialog";
import { toast } from "sonner";
import CategoryFilter from "@/components/business-english/CategoryFilter";

export default function BusinessEnglishPage() {
  const [words, setWords] = useState<BusinessEnglishWord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<BusinessEnglishWord | null>(
    null
  );

  // Delete Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [wordIdToDelete, setWordIdToDelete] = useState<string | null>(null);

  const fetchWords = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/business-english");
      if (!response.ok) {
        throw new Error("単語の取得に失敗しました。");
      }
      const data = await response.json();
      setWords(data);
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
    fetchWords();
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
      fetchWords(); // Refresh list
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
        <WordForm onWordAdded={fetchWords} />
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
      </section>

      <EditWordModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        word={selectedWord}
        onWordUpdated={fetchWords}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
