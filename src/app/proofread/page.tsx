import { EnglishReviseForm } from "@/components/english-revise-form";

export default function ProofreadPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto">
      <div className="w-full flex justify-end px-2">
        <a
          href="/special-lesson/quiz"
          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 transition-colors"
        >
          <span>👉 Try Special Challenge: The Dual Imperative</span>
        </a>
      </div>
      <EnglishReviseForm />
    </div>
  );
}
