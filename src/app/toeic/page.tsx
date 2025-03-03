"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ERROR_MESSAGES } from "@/config/ERROR_MESSAGES";
import { descriptionTypeKeys, descriptionTypeOptions } from "@/config/toeic";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  sentence: z.string().min(2, {
    message: "2文字以上で入力してください。",
  }),
  description_type: z.enum(["grammar", "vocabulary"]),
});

const saveFormSchema = z.object({
  sentence: z.string(),
  description: z.string(),
});

const ToeicPage = () => {
  const [result, setResult] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sentence: "",
      description_type: descriptionTypeKeys[0],
    },
  });

  const saveForm = useForm<z.infer<typeof saveFormSchema>>({
    resolver: zodResolver(saveFormSchema),
    defaultValues: {
      sentence: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      const response = await fetch("/api/toeic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("送信に失敗しました。");
      }

      const data = await response.json();
      setResult(data.description);
      // Update the saveForm values when we get a new result
      saveForm.setValue("sentence", values.sentence);
      saveForm.setValue("description", data.description);
      toast.success("完了しました。");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(ERROR_MESSAGES.ja.FRONTEND.GENERAL.UNEXPECTED);
      }
    }
  };

  const saveToNotion = async (values: z.infer<typeof saveFormSchema>) => {
    try {
      const response = await fetch("/api/save-to-notion-toeic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("送信に失敗しました。");
      }

      await response.json();
      toast.success("完了しました。");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(ERROR_MESSAGES.ja.FRONTEND.GENERAL.UNEXPECTED);
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full container p-4 mx-auto space-y-6">
        {/* フォーム */}
        <Card>
          <CardHeader>
            <CardTitle>TOEIC復習用のフォーム</CardTitle>
            <CardDescription>
              入力された例文はAIによって和訳され、Notionに保存されます。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="flex flex-col space-y-10"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                {/* 例文挿入 */}
                <FormField
                  control={form.control}
                  name="sentence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>例文を挿入してください</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={10}
                          placeholder="ここに例文を入れてください"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 添削指定 */}
                <FormField
                  control={form.control}
                  name="description_type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>文章表現</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {Object.entries(descriptionTypeOptions).map(
                            ([key, value]) => (
                              <FormItem
                                key={key}
                                className="flex items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <RadioGroupItem value={key} />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {value}
                                </FormLabel>
                              </FormItem>
                            )
                          )}
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>
                        どこに焦点を当てて解説するか選択してください。
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 送信ボタン */}
                <Button
                  type="submit"
                  className="w-full bg-green-400 hover:bg-green-400/80 hover:bg-opacity-80 text-white font-bold"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />{" "}
                      <span>処理中...</span>
                    </>
                  ) : (
                    <span>解説</span>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* 結果 */}
        <Card>
          <CardHeader>
            <CardTitle>結果</CardTitle>
            <CardDescription>
              送信後のAIによる回答が出力されます
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none break-words">
              {result ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {result}
                </ReactMarkdown>
              ) : (
                <p className="text-gray-500">添削結果がここに表示されます...</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Form {...saveForm}>
              <form
                className="w-full"
                onSubmit={saveForm.handleSubmit(saveToNotion)}
              >
                <Button
                  type="submit"
                  className="w-full"
                  variant="green"
                  disabled={!result || saveForm.formState.isSubmitting}
                >
                  {saveForm.formState.isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />{" "}
                      <span>処理中...</span>
                    </>
                  ) : (
                    <span>Notionに保存</span>
                  )}
                </Button>
              </form>
            </Form>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};

export default ToeicPage;
