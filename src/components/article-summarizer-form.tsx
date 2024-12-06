"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const formSchema = z.object({
  url: z.string().url({ message: "有効なURLを入力してください" }),
  category: z.string().min(1, { message: "カテゴリを選択してください" }),
});

export function ArticleSummarizerForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      category: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("要約の送信に失敗しました。");
      }

      const data = await response.json();
      toast.success(`要約が正常に送信されました。${data}`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("予期せぬエラーが発生しました。");
      }
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white text-black">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">記事要約ツール</CardTitle>
        <CardDescription>
          URLを入力し、カテゴリを選択して記事を要約します
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>記事URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/article"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    要約したい記事のURLを入力してください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>カテゴリ</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="カテゴリを選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="technology">テクノロジー</SelectItem>
                      <SelectItem value="business">ビジネス</SelectItem>
                      <SelectItem value="science">科学</SelectItem>
                      <SelectItem value="health">健康</SelectItem>
                      <SelectItem value="other">その他</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    記事のカテゴリを選択してください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-[#84C98B] hover:bg-[#6BAF72] text-white"
            >
              要約して保存
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
