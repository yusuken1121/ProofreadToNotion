"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react";

export default function MemoQuizPage() {
  const router = useRouter();
  const [fullText, setFullText] = useState("");
  const [segments, setSegments] = useState<string[]>([]);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [mode, setMode] = useState<"study" | "quiz">("study");
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null
  );

  useEffect(() => {
    const text = localStorage.getItem("memorizationText");
    if (!text) {
      router.push("/proofread");
      return;
    }
    setFullText(text);

    // Parse English text
    // Try to match the specific "Comprehensive Text (English)" section
    // Fallback to simpler extraction if not found
    const englishMatch = text.match(
      /## 2\. Comprehensive Text \(English\)\n([\s\S]*?)\n(##|$)/
    );

    let textToSplit = "";
    if (englishMatch && englishMatch[1]) {
      textToSplit = englishMatch[1].trim();
    } else {
      // Fallback: Try to find any English-looking block or just use the whole text if it's short
      // For now, if generic structure, maybe just take the whole thing?
      // But usually the prompt output has sections.
      // Let's assume the sections exist or just split the whole text.
      textToSplit = text;
    }

    // Split into sentences/segments
    // Basic split by period/newline, cleaning up empty strings
    const rawSegments = textToSplit
      .split(/(?<=[.!?])\s+|\n+/)
      .map((s) => s.trim())
      .filter(
        (s) => s.length > 0 && !s.startsWith("#") && !s.startsWith("---")
      );

    setSegments(rawSegments);
  }, [router]);

  const handleStartQuiz = () => {
    setMode("quiz");
    setCurrentSegmentIndex(0);
    setUserInput("");
    setFeedback(null);
    setShowHint(false);
  };

  const checkAnswer = () => {
    const current = segments[currentSegmentIndex];
    // Simple normalization: remove punctuation, lowercase
    const normalize = (s: string) =>
      s
        .replace(/[^\w\s]/g, "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

    if (normalize(userInput) === normalize(current)) {
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }
  };

  const nextSegment = () => {
    if (currentSegmentIndex < segments.length - 1) {
      setCurrentSegmentIndex((prev) => prev + 1);
      setUserInput("");
      setFeedback(null);
      setShowHint(false);
    } else {
      // Finished
      alert("Compeleted!");
      setMode("study");
    }
  };

  if (!fullText) return null;

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      {mode === "study" && (
        <Card>
          <CardHeader>
            <CardTitle>Study Material</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {fullText}
              </ReactMarkdown>
            </div>
            <Button onClick={handleStartQuiz} className="w-full text-lg py-6">
              Start Memorization Quiz
            </Button>
          </CardContent>
        </Card>
      )}

      {mode === "quiz" && segments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Quiz Mode</span>
              <span className="text-sm font-normal text-muted-foreground">
                {currentSegmentIndex + 1} / {segments.length}
              </span>
            </CardTitle>
            <Progress
              value={(currentSegmentIndex / segments.length) * 100}
              className="h-2"
            />
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-muted-foreground">
                  Original Sentence (Hidden)
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                >
                  {showHint ? (
                    <EyeOff className="h-4 w-4 mr-1" />
                  ) : (
                    <Eye className="h-4 w-4 mr-1" />
                  )}
                  {showHint ? "Hide" : "Peek"}
                </Button>
              </div>

              {showHint ? (
                <div className="p-4 bg-muted rounded-md text-lg font-medium">
                  {segments[currentSegmentIndex]}
                </div>
              ) : (
                <div className="p-4 bg-muted rounded-md h-16 flex items-center justify-center text-muted-foreground italic">
                  (Type the sentence below)
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type the sentence here..."
                className="min-h-[100px] text-lg bg-background"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (feedback === "correct") nextSegment();
                    else checkAnswer();
                  }
                }}
              />
            </div>

            {feedback && (
              <div
                className={`p-4 rounded-md flex items-center gap-2 ${
                  feedback === "correct"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-destructive/15 text-destructive"
                }`}
              >
                {feedback === "correct" ? (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-bold">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5" />
                    <span className="font-bold">
                      Incorrect. Try again or peek.
                    </span>
                  </>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={checkAnswer}
                className="flex-1"
                disabled={feedback === "correct"}
              >
                Check
              </Button>
              {feedback === "correct" && (
                <Button
                  onClick={nextSegment}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Next Sentence
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
