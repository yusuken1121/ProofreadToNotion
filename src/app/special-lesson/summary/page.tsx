"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LESSONS } from "../data";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Download,
  Languages,
  FileText,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SummaryPage() {
  const router = useRouter();
  const [selectedLessonId, setSelectedLessonId] = useState(LESSONS[0].id);

  // Initialize from URL query param if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lessonId = params.get("lessonId");
    if (lessonId && LESSONS.some((l) => l.id === lessonId)) {
      setSelectedLessonId(lessonId);
    }
  }, []);

  const currentLesson =
    LESSONS.find((l) => l.id === selectedLessonId) || LESSONS[0];
  const SUMMARY_SECTIONS = currentLesson.summarySections;

  const getIconForSection = (id: string) => {
    switch (id) {
      case "project-title":
        return <BookOpen className="h-5 w-5 text-chart-1" />;
      case "english-text":
        return <Languages className="h-5 w-5 text-chart-2" />;
      case "japanese-text":
        return <Languages className="h-5 w-5 text-chart-3" />;
      case "summary-japanese":
        return <FileText className="h-5 w-5 text-chart-4" />;
      case "essential-phrases":
        return <Sparkles className="h-5 w-5 text-chart-5" />;
      case "grammar-highlights":
        return <GraduationCap className="h-5 w-5 text-primary" />;
      default:
        return <BookOpen className="h-5 w-5 text-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between no-print">
          <Button
            variant="ghost"
            onClick={() =>
              router.push(`/special-lesson/quiz?lessonId=${selectedLessonId}`)
            }
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quiz
          </Button>
          <div className="w-[180px]">
            <Select
              value={selectedLessonId}
              onValueChange={setSelectedLessonId}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select a lesson" />
              </SelectTrigger>
              <SelectContent>
                {LESSONS.map((lesson) => (
                  <SelectItem
                    key={lesson.id}
                    value={lesson.id}
                    className="text-xs"
                  >
                    {lesson.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Hero Header */}
        <div className="bg-primary rounded-3xl p-8 md:p-12 shadow-2xl text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-background/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-background/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Comprehensive Study Guide
            </h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl">
              Deep dive into the material with full translations, grammar
              analysis, and key vocabulary.
            </p>
          </div>
        </div>

        {/* Content Cards */}
        <div className="space-y-8">
          {SUMMARY_SECTIONS.map((section) => (
            <Card
              key={section.id}
              className="overflow-hidden border-border shadow-lg"
            >
              <div className="border-b border-border bg-muted/50 p-6 flex items-center gap-3">
                <div className="p-2 bg-card rounded-lg shadow-sm">
                  {getIconForSection(section.id)}
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  {section.title}
                </h2>
              </div>
              <CardContent className="p-8 md:p-10">
                <article
                  className="prose prose-lg dark:prose-invert max-w-none
                  prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
                  prose-p:leading-loose prose-p:text-muted-foreground prose-p:mb-8
                  prose-strong:text-foreground prose-strong:font-bold prose-strong:bg-muted prose-strong:px-1 prose-strong:rounded
                  prose-li:marker:text-primary prose-li:text-muted-foreground
                  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-foreground
                "
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, ...props }) => (
                        <h3
                          className="text-2xl font-bold mt-8 mb-6 text-primary border-b pb-2 border-border"
                          {...props}
                        />
                      ),
                      h2: ({ node, ...props }) => (
                        <h4
                          className="text-xl font-bold mt-8 mb-4 text-primary flex items-center gap-2"
                          {...props}
                        />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul
                          className="my-6 space-y-3 list-disc pl-6"
                          {...props}
                        />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol
                          className="my-6 space-y-4 list-decimal pl-6"
                          {...props}
                        />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="pl-2 leading-loose" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="leading-[2.0] mb-6 text-lg" {...props} />
                      ),
                    }}
                  >
                    {section.content}
                  </ReactMarkdown>
                </article>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer actions */}
        <div className="flex justify-center pb-12 print:hidden">
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 rounded-full shadow-xl transition-all hover:scale-105 active:scale-95"
            onClick={() => window.print()}
          >
            <Download className="mr-2 h-4 w-4" />
            Save as PDF
          </Button>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .shadow-xl,
          .shadow-2xl,
          .shadow-lg {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
