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
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCcw,
  Eye,
  Sparkles,
  Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BusinessEnglishWord } from "@/types/BusinessEnglish.Type";
import { Skeleton } from "@/components/ui/skeleton";

export default function PracticePage() {
  const router = useRouter();
  const [words, setWords] = useState<BusinessEnglishWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null
  );
  const [showHint, setShowHint] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchWords = async () => {
    setIsLoading(true);
    try {
      // Fetch a larger batch for practice, or handle pagination later.
      // For now, let's fetch the first page, same as the main list.
      // Ideally, we might want a random set, but let's start simple.
      const response = await fetch(`/api/business-english?page_size=20`);
      if (!response.ok) {
        throw new Error("Failed to fetch words.");
      }
      const data = await response.json();
      // Shuffle the words for practice
      const shuffled = data.words.sort(() => 0.5 - Math.random());
      setWords(shuffled);
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
  };

  useEffect(() => {
    fetchWords();
  }, []);

  useEffect(() => {
    if (textareaRef.current && !isLoading && words.length > 0) {
      textareaRef.current.focus();
    }
  }, [currentIndex, isLoading, words]);

  const currentWord = words[currentIndex];
  // Calculate progress
  const progress = words.length > 0 ? (currentIndex / words.length) * 100 : 0;

  const normalize = (s: string) =>
    s
      .replace(/[^\w\s]/g, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

  const handleCheck = () => {
    if (!currentWord) return;
    if (normalize(userInput) === normalize(currentWord.english)) {
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserInput("");
      setFeedback(null);
      setShowHint(false);
    } else {
      // End of quiz
      // You might want to redirect to summary or show a completion screen
      // For now, let's just loop or show a finished message
      // Or redirect back to the list
      router.push("/business-english");
    }
  };

  const handleSpeak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-lg">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">No words found to practice.</p>
        <Button onClick={() => router.push("/business-english")}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Writing Practice
          </h1>
          <p className="text-lg text-muted-foreground">
            Translate the Japanese phrase into English.
          </p>
        </div>

        <Card className="border-border shadow-2xl bg-card/50 backdrop-blur-sm overflow-hidden ring-1 ring-border relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-muted">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Question {currentIndex + 1} of {words.length}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/business-english")}
              className="text-muted-foreground hover:text-primary"
            >
              Exit
            </Button>
          </CardHeader>

          <CardContent className="space-y-8 pt-8">
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-chart-1 uppercase tracking-wider mb-2">
                Japanese
              </h3>
              <p className="text-xl md:text-3xl font-bold leading-relaxed text-foreground font-serif text-center py-8">
                {currentWord.japanese}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-chart-2 uppercase tracking-wider">
                  Your Answer (English)
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
                    <div className="w-full h-full p-6 overflow-y-auto flex flex-col items-center justify-center gap-4">
                      <p className="text-lg font-medium text-primary m-auto text-center">
                        {currentWord.english}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSpeak(currentWord.english)}
                      >
                        <Volume2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                )}

                <Textarea
                  ref={textareaRef}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type the English translation..."
                  className={cn(
                    "min-h-[120px] resize-none text-lg p-6 shadow-inner transition-all duration-300 bg-background text-foreground placeholder:text-muted-foreground",
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
                        <span>Correct!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        <span>Incorrect</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* Show correct answer if incorrect */}
            {feedback === "incorrect" && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
                <p className="text-sm font-semibold text-destructive mb-1">
                  Correct Answer:
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-lg">{currentWord.english}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleSpeak(currentWord.english)}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="bg-muted/50 p-6 flex justify-end gap-3 border-t border-border">
            {feedback !== "correct" ? (
              <Button
                onClick={handleCheck}
                className="w-full sm:w-auto text-lg px-8 py-6"
              >
                Check Answer
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="w-full sm:w-auto text-lg px-8 py-6 bg-green-600 hover:bg-green-500 text-white"
              >
                <span>Next Word</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
