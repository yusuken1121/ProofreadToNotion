"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FULL_MARKDOWN_CONTENT, SUMMARY_SECTIONS } from "../data";
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

export default function SummaryPage() {
  const router = useRouter();

  const getIconForSection = (id: string) => {
    switch (id) {
      case "project-title":
        return <BookOpen className="h-5 w-5 text-indigo-500" />;
      case "english-text":
        return <Languages className="h-5 w-5 text-blue-500" />;
      case "japanese-text":
        return <Languages className="h-5 w-5 text-emerald-500" />;
      case "summary-japanese":
        return <FileText className="h-5 w-5 text-orange-500" />;
      case "essential-phrases":
        return <Sparkles className="h-5 w-5 text-amber-500" />;
      case "grammar-highlights":
        return <GraduationCap className="h-5 w-5 text-purple-500" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between no-print">
          <Button
            variant="ghost"
            onClick={() => router.push("/special-lesson/quiz")}
            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quiz
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Dual Imperative Module
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Comprehensive Study Guide
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl">
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
              className="overflow-hidden border-0 shadow-lg ring-1 ring-slate-200 dark:ring-slate-800"
            >
              <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-6 flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                  {getIconForSection(section.id)}
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                  {section.title}
                </h2>
              </div>
              <CardContent className="p-8 md:p-10">
                <article
                  className="prose prose-lg prose-slate dark:prose-invert max-w-none
                  prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-slate-50
                  prose-p:leading-loose prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:mb-8
                  prose-strong:text-slate-900 dark:prose-strong:text-slate-100 prose-strong:font-bold prose-strong:bg-slate-100 dark:prose-strong:bg-slate-800 prose-strong:px-1 prose-strong:rounded
                  prose-li:marker:text-indigo-500 prose-li:text-slate-700 dark:prose-li:text-slate-300
                  prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-800/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-300
                "
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, ...props }) => (
                        <h3
                          className="text-2xl font-bold mt-8 mb-6 text-indigo-700 dark:text-indigo-300 border-b pb-2 border-slate-200 dark:border-slate-700"
                          {...props}
                        />
                      ),
                      h2: ({ node, ...props }) => (
                        <h4
                          className="text-xl font-bold mt-8 mb-4 text-indigo-600 dark:text-indigo-400 flex items-center gap-2"
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
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 rounded-full shadow-xl transition-all hover:scale-105 active:scale-95"
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
