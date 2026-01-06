import { EnglishReviseForm } from "@/components/english-revise-form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start py-12 bg-gray-50 dark:bg-gray-900 gap-8">
      <div className="w-full max-w-2xl px-4 flex justify-end">
        <a
          href="/special-lesson/quiz"
          className="text-sm text-blue-600 hover:underline"
        >
          👉 Try Special Challenge: The Dual Imperative
        </a>
      </div>
      <EnglishReviseForm />
    </main>
  );
}
