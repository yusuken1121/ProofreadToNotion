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

  const handleNext = () => {
    if (currentIndex < QUIZ_SEGMENTS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setUserInput("");
      setFeedback(null);
      setShowHint(false);
    } else {
      router.push("/special-lesson/summary");
    }
  };

  const handleSkip = () => {
    router.push("/special-lesson/summary");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Dual Imperative
            </span>{" "}
            Challenge
          </h1>
          <p className="text-lg text-muted-foreground">
            Master the corporate ecosystem vocabulary through sentence
            reconstruction.
          </p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm overflow-hidden ring-1 ring-slate-900/5 dark:ring-slate-100/10">
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
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
              <h3 className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                Japanese Source
              </h3>
              <p className="text-xl md:text-2xl font-bold leading-relaxed text-slate-800 dark:text-slate-100 font-serif">
                {currentSegment.japanese}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
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
                  <div className="absolute inset-0 z-10 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur flex items-center justify-center p-6 text-center border rounded-lg border-blue-100 dark:border-blue-900/50 animate-in fade-in zoom-in-95 duration-200">
                    <p className="text-lg font-medium text-blue-800 dark:text-blue-200">
                      {currentSegment.english}
                    </p>
                  </div>
                )}
                <Textarea
                  ref={textareaRef}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type the English translation here..."
                  className={cn(
                    "min-h-[160px] resize-none text-lg p-6 shadow-inner transition-all duration-300",
                    feedback === "correct"
                      ? "border-green-500 bg-green-50/50 dark:bg-green-900/10 focus-visible:ring-green-500"
                      : feedback === "incorrect"
                        ? "border-red-500 bg-red-50/50 dark:bg-red-900/10 focus-visible:ring-red-500"
                        : "focus-visible:ring-blue-500"
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
                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
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

          <CardFooter className="bg-slate-50/50 dark:bg-slate-900/50 p-6 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            {feedback !== "correct" ? (
              <Button
                onClick={handleCheck}
                className="w-full sm:w-auto text-lg px-8 py-6 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 transition-all hover:scale-105 active:scale-95"
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
