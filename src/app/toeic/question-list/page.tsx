"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

// UI コンポーネント
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// 型定義
import { ToeicQuestionItem } from "@/types/Toeic.Type";

// 分割したカスタムコンポーネント
import { LoadingCards } from "./_components/LoadingCards";
import { ErrorCard, EmptyStateCard } from "./_components/StatusCards";
import { QuestionCard } from "./_components/QuestionCard";

export default function QuestionListPage() {
  const [questions, setQuestions] = useState<ToeicQuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchQuestions();
  }, []);

  // 質問リストを取得する関数
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/toeic/question-list", {});
      const data = await response.json();
      console.log("質問リスト:", data);

      if (!data.success) {
        throw new Error(data.error || "質問リストの取得に失敗しました");
      }

      setQuestions(data.data || []);
    } catch (err) {
      console.error("質問リストの取得エラー:", err);
      setError(
        err instanceof Error ? err.message : "予期せぬエラーが発生しました"
      );
    } finally {
      setLoading(false);
    }
  };

  // チェックボックスの状態を更新する関数
  const updateCheckbox = async (pageId: string, completed: boolean) => {
    // 更新中の状態を設定
    setPendingUpdates((prev) => new Set(prev).add(pageId));

    try {
      const response = await fetch("/api/toeic/update-checkbox", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pageId,
          completed,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "更新に失敗しました");
      }

      // 成功したら質問リストを更新
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) => (q.id === pageId ? { ...q, completed } : q))
      );

      toast.success("状態を更新しました");
    } catch (err) {
      console.error("チェックボックス更新エラー:", err);
      toast.error(err instanceof Error ? err.message : "更新に失敗しました");

      // エラーの場合は元に戻す
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === pageId ? { ...q, completed: !completed } : q
        )
      );
    } finally {
      // 更新中の状態を解除
      setPendingUpdates((prev) => {
        const newSet = new Set(prev);
        newSet.delete(pageId);
        return newSet;
      });
    }
  };

  // 条件別レンダリング
  const renderContent = () => {
    if (loading) {
      return <LoadingCards />;
    }

    if (error) {
      return <ErrorCard message={error} />;
    }

    if (questions.length === 0) {
      return <EmptyStateCard />;
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            pendingUpdates={pendingUpdates}
            onUpdateCheckbox={updateCheckbox}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>TOEIC 質問リスト</CardTitle>
          <CardDescription>Notionから取得したTOEIC質問一覧</CardDescription>
        </CardHeader>
      </Card>

      {renderContent()}
    </div>
  );
}
