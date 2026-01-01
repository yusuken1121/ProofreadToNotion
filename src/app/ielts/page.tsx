"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Play, Send, Save, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Types matching our API response
interface IELTSFeedback {
  overall_band: number;
  criteria: {
    TR: { score: number; feedback: string };
    CC: { score: number; feedback: string };
    LR: { score: number; feedback: string };
    GRA: { score: number; feedback: string };
  };
  rewrite_suggestion: string;
  weakness_tags: string[];
  key_vocabulary: Array<{ word: string; meaning: string; example: string }>;
}

export default function IELTSPage() {
  const [phase, setPhase] = useState<
    "idle" | "writing" | "analyzing" | "result"
  >("idle");
  const [taskType, setTaskType] = useState<"Task 1" | "Task 2">("Task 2");
  const [essay, setEssay] = useState("");
  const [feedback, setFeedback] = useState<IELTSFeedback | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [question, setQuestion] = useState("");
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);

  // Simple Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phase === "writing") {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phase]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = async () => {
    setPhase("writing");
    setElapsedTime(0);
    setFeedback(null);
    setEssay("");
    setQuestion("");
    setIsLoadingQuestion(true);

    try {
      const res = await fetch("/api/ielts/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskType }),
      });
      const data = await res.json();
      if (data.question) setQuestion(data.question);
    } catch (e) {
      console.error("Failed to generate question");
      setQuestion(
        "Describe a traditional festival in your country and explain its significance."
      );
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  const handleSubmit = async () => {
    if (!essay.trim()) {
      toast.error("Please write something before submitting.");
      return;
    }

    setPhase("analyzing");
    try {
      const res = await fetch("/api/ielts/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ essay, taskType }),
      });

      if (!res.ok) throw new Error("Analysis failed");

      const data = await res.json();
      setFeedback(data);
      setPhase("result");

      // Auto-sync could happen here, but let's make it manual or explicit for now to give control
      handleSync(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze essay. Please try again.");
      setPhase("writing");
    }
  };

  const handleSync = async (dataToSync: IELTSFeedback) => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/ielts/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diaryEntry: essay,
          scores: {
            overall: dataToSync.overall_band,
            TR: dataToSync.criteria.TR.score,
            CC: dataToSync.criteria.CC.score,
            LR: dataToSync.criteria.LR.score,
            GRA: dataToSync.criteria.GRA.score,
          },
          taskType,
          weaknessTags: dataToSync.weakness_tags,
          vocabulary: dataToSync.key_vocabulary,
        }),
      });

      if (!res.ok) throw new Error("Sync failed");

      toast.success("Saved to Notion successfully!", {
        description: "Your session has been logged and assets created.",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to sync to Notion.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl py-10 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            IELTS Writing Debugger
          </h1>
          <p className="text-muted-foreground mt-1">
            Engineered for Band 7.0+. Stop guessing, start measuring.
          </p>
        </div>

        {phase === "writing" && (
          <div className="text-2xl font-mono font-medium tabular-nums bg-secondary px-4 py-2 rounded-md">
            {formatTime(elapsedTime)}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Editor */}
        <div className="md:col-span-2 space-y-6">
          <Card className="h-full flex flex-col border-2 focus-within:border-primary transition-colors">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Workspace</CardTitle>
                <Select
                  value={taskType}
                  onValueChange={(v) => setTaskType(v as "Task 1" | "Task 2")}
                  disabled={phase !== "idle"}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Task Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Task 1">Task 1</SelectItem>
                    <SelectItem value="Task 2">Task 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-[400px]">
              {phase === "idle" ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-70">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Play size={32} />
                  </div>
                  <p>Ready to debug your writing?</p>
                  <Button onClick={handleStart} size="lg">
                    Start Session
                  </Button>
                </div>
              ) : (
                <>
                  {isLoadingQuestion ? (
                    <div className="flex items-center justify-center p-6 bg-muted/30 rounded-lg mb-4 border-2 border-dashed animate-pulse">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                      Generating Topic...
                    </div>
                  ) : question ? (
                    <div className="bg-muted p-4 rounded-lg mb-4 text-sm font-serif italic border-l-4 border-primary">
                      {question}
                    </div>
                  ) : null}
                  <Textarea
                    placeholder="Start typing your essay here..."
                    className="flex-1 resize-none text-lg leading-relaxed p-4 border-none focus-visible:ring-0"
                    value={essay}
                    onChange={(e) => setEssay(e.target.value)}
                    disabled={phase === "analyzing"}
                  />
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      {essay.split(/\s+/).filter((w) => w.length > 0).length}{" "}
                      words
                    </div>
                    {phase === "writing" && (
                      <Button onClick={handleSubmit} disabled={!essay.trim()}>
                        <Send className="mr-2 h-4 w-4" /> Analyze
                      </Button>
                    )}
                    {phase === "analyzing" && (
                      <Button disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Debugging...
                      </Button>
                    )}
                    {phase === "result" && (
                      <Button onClick={handleStart} variant="outline">
                        New Session
                      </Button>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Feedback */}
        <div className="md:col-span-1 space-y-6">
          {phase === "result" && feedback ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Overall Score */}
              <Card className="bg-primary text-primary-foreground border-primary">
                <CardHeader className="pb-2">
                  <CardDescription className="text-primary-foreground/80">
                    Overall Band
                  </CardDescription>
                  <CardTitle className="text-5xl font-extrabold">
                    {feedback.overall_band}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    {feedback.weakness_tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-white/20 hover:bg-white/30 text-white border-none"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Criteria Breakdown */}
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(feedback.criteria).map(([key, data]) => (
                  <Card
                    key={key}
                    className={
                      data.score < 7
                        ? "border-red-200 bg-red-50 dark:bg-red-950/20"
                        : ""
                    }
                  >
                    <CardHeader className="p-4 pb-1">
                      <div className="flex justify-between items-baseline">
                        <CardTitle className="text-sm text-muted-foreground">
                          {key}
                        </CardTitle>
                        <span
                          className={`font-bold ${data.score >= 7 ? "text-green-600" : "text-amber-600"}`}
                        >
                          {data.score}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-1">
                      <Progress
                        value={(data.score / 9) * 100}
                        className="h-1.5"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {isSyncing ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" /> Syncing to
                    Notion...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-green-500" /> Synced
                    to Notion
                  </>
                )}
              </div>
            </div>
          ) : (
            <Card className="h-full border-dashed bg-muted/50 border-2">
              <CardContent className="h-full flex flex-col items-center justify-center text-muted-foreground text-center p-6">
                <div className="mb-4">
                  {phase === "analyzing" ? (
                    <Loader2 className="h-8 w-8 animate-spin mx-auto opacity-50" />
                  ) : (
                    <div className="h-8 w-8 rounded-full border-2 border-current mx-auto opacity-20" />
                  )}
                </div>
                <p className="text-sm">
                  {phase === "analyzing"
                    ? "Gemini is analyzing your logic, grammar, and vocabulary..."
                    : "Analysis results will appear here."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Detailed Analysis Section (Only visible when result is available) */}
      {phase === "result" && feedback && (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 delay-150">
          <Tabs defaultValue="feedback" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="feedback">Detailed Feedback</TabsTrigger>
              <TabsTrigger value="rewrite">Rewrite Suggestion</TabsTrigger>
              <TabsTrigger value="vocab">
                Vocabulary ({feedback.key_vocabulary.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="feedback" className="space-y-4 mt-4">
              {Object.entries(feedback.criteria).map(([key, data]) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle className="flex justify-between">
                      <span>{key} Analysis</span>
                      <Badge
                        variant={data.score >= 7 ? "default" : "destructive"}
                      >
                        Band {data.score}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{data.feedback}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="rewrite" className="mt-4">
              <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-green-200 dark:border-green-900">
                <CardHeader>
                  <CardTitle className="text-green-700 dark:text-green-400 text-lg">
                    Band 8.0 Model Revision
                  </CardTitle>
                  <CardDescription>
                    A clearer, more cohesive way to express your main points.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap leading-7 font-serif text-lg">
                    {feedback.rewrite_suggestion}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="vocab" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedback.key_vocabulary.map((vocab, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-primary">
                        {vocab.word}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p>
                        <strong>Meaning:</strong> {vocab.meaning}
                      </p>
                      <p className="text-muted-foreground italic">
                        &quot;{vocab.example}&quot;
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
