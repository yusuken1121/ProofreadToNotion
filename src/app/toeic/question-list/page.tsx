"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToeicQuestionItem } from "@/types/Toeic.Type";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

export default function QuestionListPage() {
  const [questions, setQuestions] = useState<ToeicQuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/toeic/question-list");
        const data = await response.json();

        console.log("⭐️", data);

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

    fetchQuestions();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "yyyy年MM月dd日 HH:mm");
    } catch {
      return dateString;
    }
  };

  // ページブロックの内容を表示するヘルパー関数
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderPageContent = (content: any) => {
    if (!content || !Array.isArray(content) || content.length === 0) {
      return (
        <p className="text-sm text-muted-foreground italic">
          コンテンツがありません
        </p>
      );
    }

    return (
      <div className="space-y-2">
        {content.map((block, index) => {
          // ブロックタイプごとの表示方法を定義
          switch (block.type) {
            case "paragraph":
              return (
                <div key={index} className="text-sm">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {block.content?.rich_text?.map((text: any, i: number) => (
                    <span
                      key={i}
                      className={`
                      ${text.annotations?.bold ? "font-bold" : ""}
                      ${text.annotations?.italic ? "italic" : ""}
                      ${text.annotations?.underline ? "underline" : ""}
                      ${text.annotations?.strikethrough ? "line-through" : ""}
                      ${
                        text.annotations?.code
                          ? "font-mono bg-slate-100 px-1 rounded"
                          : ""
                      }
                    `}
                    >
                      {text.plain_text}
                    </span>
                  )) || "空のパラグラフ"}
                </div>
              );

            case "heading_1":
            case "heading_2":
            case "heading_3":
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const headingSize: Record<string, string> = {
                heading_1: "text-xl font-bold",
                heading_2: "text-lg font-bold",
                heading_3: "text-base font-bold",
              };

              return (
                <div key={index} className={headingSize[block.type]}>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {block.content?.rich_text?.map((text: any, i: number) => (
                    <span key={i}>{text.plain_text}</span>
                  )) || "見出し"}
                </div>
              );

            case "bulleted_list_item":
            case "numbered_list_item":
              return (
                <div key={index} className="flex">
                  <span className="mr-2">
                    {block.type === "bulleted_list_item"
                      ? "•"
                      : `${index + 1}.`}
                  </span>
                  <span>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {block.content?.rich_text?.map((text: any, i: number) => (
                      <span key={i}>{text.plain_text}</span>
                    )) || "リストアイテム"}
                  </span>
                </div>
              );

            default:
              return (
                <div key={index} className="text-xs text-gray-500">
                  {`[${block.type}ブロック]`}
                </div>
              );
          }
        })}
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

      {loading ? (
        // ローディング中の表示
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-4/5" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-1/4" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        // エラー時の表示
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600">エラーが発生しました</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      ) : questions.length === 0 ? (
        // データがない場合の表示
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              質問が見つかりませんでした
            </p>
          </CardContent>
        </Card>
      ) : (
        // 質問リストの表示
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {questions.map((question) => (
            <Card key={question.id} className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-lg ">
                  {question.sentence || "（文章なし）"}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                {question.pageContent && question.pageContent.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="content">
                      <AccordionTrigger className="text-sm font-medium">
                        ページの内容を表示
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 space-y-3">
                          {renderPageContent(question.pageContent)}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : (
                  <p className="text-sm text-muted-foreground break-all line-clamp-3">
                    {question.sentence || "文章内容がありません"}
                  </p>
                )}
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                <div className="w-full flex flex-col gap-1">
                  <Separator />
                  <div className="pt-1">
                    作成日: {formatDate(question.createdTime)}
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
