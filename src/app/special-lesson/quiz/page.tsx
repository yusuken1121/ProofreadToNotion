"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { QUIZ_SEGMENTS } from "../data";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCcw,
  Eye,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function QuizPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null
  );
  const [showHint, setShowHint] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentSegment = QUIZ_SEGMENTS[currentIndex];
  const progress = (currentIndex / QUIZ_SEGMENTS.length) * 100;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [currentIndex]);

  const normalize = (s: string) =>
    s
      .replace(/[^\w\s]/g, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

  const handleCheck = () => {
    if (normalize(userInput) === normalize(currentSegment.english)) {
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }
  };

  const goToPage = (index: number) => {
    setCurrentIndex(index);
    setUserInput("");
    setFeedback(null);
    setShowHint(false);
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_SEGMENTS.length - 1) {
      goToPage(currentIndex + 1);
    } else {
      router.push("/special-lesson/summary");
    }
  };

  const handleSkip = () => {
    router.push("/special-lesson/summary");
  };

  const getPageNumbers = (current: number, total: number) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
    if (current >= total - 3)
      return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            <span className="bg-gradient-to-r from-primary to-chart-1 text-transparent bg-clip-text">
              Dual Imperative
            </span>{" "}
            Challenge
          </h1>
          <p className="text-lg text-muted-foreground">
            Master the corporate ecosystem vocabulary through sentence
            reconstruction.
          </p>
        </div>

        <Card className="border-border shadow-2xl bg-card/50 backdrop-blur-sm overflow-hidden ring-1 ring-border">
          <div className="absolute top-0 left-0 w-full h-1 bg-muted">
            <div
              className="h-full bg-gradient-to-r from-chart-1 to-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Segment {currentIndex + 1} of {QUIZ_SEGMENTS.length}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-muted-foreground hover:text-primary"
              >
                Skip to Summary
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 pt-8">
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-chart-1 uppercase tracking-wider mb-2">
                Japanese Source
              </h3>
              <p className="text-xl md:text-2xl font-bold leading-relaxed text-foreground font-serif">
                {currentSegment.japanese}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-chart-2 uppercase tracking-wider">
                  Your Translation
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs text-muted-foreground h-auto py-1"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  {showHint ? "Hide Answer" : "Peek Answer"}
                </Button>
              </div>

              <div className="relative">
                {showHint && (
                  <div className="absolute inset-0 z-10 bg-card/95 backdrop-blur flex items-center justify-center border rounded-lg border-border animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                    <div className="w-full h-full p-6 overflow-y-auto flex flex-col">
                      <p className="text-lg font-medium text-primary m-auto text-center">
                        {currentSegment.english}
                      </p>
                    </div>
                  </div>
                )}
                <Textarea
                  ref={textareaRef}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type the English translation here..."
                  className={cn(
                    "min-h-[160px] resize-none text-lg p-6 shadow-inner transition-all duration-300 bg-background text-foreground placeholder:text-muted-foreground",
                    feedback === "correct"
                      ? "border-green-500 bg-green-50/50 dark:bg-green-900/10 focus-visible:ring-green-500"
                      : feedback === "incorrect"
                        ? "border-destructive bg-destructive/10 focus-visible:ring-destructive"
                        : "focus-visible:ring-primary border-input"
                  )}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (feedback === "correct") handleNext();
                      else handleCheck();
                    }
                  }}
                  disabled={feedback === "correct"}
                />

                {feedback && (
                  <div
                    className={cn(
                      "absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm animate-in slide-in-from-bottom-2",
                      feedback === "correct"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-destructive/20 text-destructive"
                    )}
                  >
                    {feedback === "correct" ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Perfect Match</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        <span>Try Again</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-muted/50 p-6 flex justify-end gap-3 border-t border-border">
            {feedback !== "correct" ? (
              <Button
                onClick={handleCheck}
                className="w-full sm:w-auto text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              >
                Check Answer
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="w-full sm:w-auto text-lg px-8 py-6 bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-600/20 transition-all hover:scale-105 active:scale-95"
              >
                <span>Continue</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            )}
          </CardFooter>
        </Card>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => currentIndex > 0 && goToPage(currentIndex - 1)}
                className={
                  currentIndex === 0
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {getPageNumbers(currentIndex + 1, QUIZ_SEGMENTS.length).map(
              (page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      isActive={page === currentIndex + 1}
                      onClick={() => goToPage(Number(page) - 1)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  currentIndex < QUIZ_SEGMENTS.length - 1 &&
                  goToPage(currentIndex + 1)
                }
                className={
                  currentIndex === QUIZ_SEGMENTS.length - 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        {feedback === "correct" && (
          <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">
                Great job! You&apos;ve mastered this segment.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
