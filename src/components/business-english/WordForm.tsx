
'use client';

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  japanese: z.string().min(1, { message: "日本語訳を入力してください。" }),
  english: z.string().min(1, { message: "英語を入力してください。" }),
});

interface WordFormProps {
  onWordAdded: () => void;
}

const WordForm = ({ onWordAdded }: WordFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      japanese: "",
      english: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/business-english", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("単語の登録に失敗しました。");
      }

      toast.success("新しい単語を登録しました。");
      form.reset();
      onWordAdded(); // 親コンポーネントに通知してデータを再取得
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("予期せぬエラーが発生しました。");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="japanese"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>日本語</FormLabel>
                  <FormControl>
                    <Input placeholder="例：会議" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="english"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>英語</FormLabel>
                  <FormControl>
                    <Input placeholder="Example: meeting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>登録中...</span>
                </>
              ) : (
                <span>登録する</span>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default WordForm;
