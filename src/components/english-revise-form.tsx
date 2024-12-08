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
import { Textarea } from "@/components/ui/textarea";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const formSchema = z.object({
  diaryEntry: z
    .string()
    .min(10, { message: "日記は少なくとも10文字以上書いてください" }),
  writingStyle: z.enum(["casual", "formal", "normal"], {
    required_error: "文章表現を選択してください",
  }),
  errorLevel: z.enum(["basic", "intermediate", "advanced"], {
    required_error: "誤りのレベルを選択してください",
  }),
  errorTypes: z
    .array(z.enum(["grammar", "vocabulary", "usage"]))
    .min(1, { message: "少なくとも1つの誤りの種類を選択してください" }),
});

const errorTypeItems = [
  { id: "grammar", label: "Grammar" },
  { id: "vocabulary", label: "Vocabulary" },
  { id: "usage", label: "Usage" },
];

export function EnglishReviseForm() {
  const [proofreadText, setProofreadText] = useState("");
  const [isProofLoading, setIsProofLoading] = useState<boolean>(false);
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diaryEntry: "",
      writingStyle: "normal",
      errorLevel: "intermediate",
      errorTypes: ["grammar"],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsProofLoading(true);
    try {
      const response = await fetch("/api/proofread", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("添削の送信に失敗しました。");
      }

      const data = await response.json();
      setProofreadText(data.proofreadText);
      toast.success("添削が完了しました。");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("予期せぬエラーが発生しました。");
      }
    } finally {
      setIsProofLoading(false);
    }
  }

  async function saveToNotion() {
    try {
      setIsSaveLoading(true);
      const response = await fetch("/api/save-to-notion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalText: form.getValues("diaryEntry"),
          proofreadText,
          writingStyle: form.getValues("writingStyle"),
        }),
      });

      if (!response.ok) {
        throw new Error("Notionへの保存に失敗しました。");
      }

      toast.success("Notionに保存しました。");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("予期せぬエラーが発生しました。");
      }
    } finally {
      setIsSaveLoading(false);
    }
  }

  return (
    <div className="w-full container p-4 mx-auto space-y-6">
      <Card className="bg-white text-black">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">英語添削ツール</CardTitle>
          <CardDescription>
            英語で書いて、AIに添削してもらいましょう
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="diaryEntry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>日記</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your diary entry here..."
                        className="min-h-[200px] text-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>英語で書いてください</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="writingStyle"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>文章表現</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="casual" />
                          </FormControl>
                          <FormLabel className="font-normal">Casual</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="formal" />
                          </FormControl>
                          <FormLabel className="font-normal">Formal</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="normal" />
                          </FormControl>
                          <FormLabel className="font-normal">Normal</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      添削する文章表現を選択してください
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="errorLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>誤りのレベル</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="誤りのレベルを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      添削する誤りのレベルを選択してください
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="errorTypes"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">誤りの種類</FormLabel>
                      <FormDescription>
                        添削する誤りの種類を選択してください（複数選択可）
                      </FormDescription>
                    </div>
                    {errorTypeItems.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="errorTypes"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(
                                    item.id as
                                      | "grammar"
                                      | "vocabulary"
                                      | "usage"
                                  )}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-primary-green hover:bg-primary-green hover:bg-opacity-80 text-white"
                disabled={isProofLoading}
              >
                {isProofLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />{" "}
                    <span>処理中...</span>
                  </>
                ) : (
                  <span>添削する</span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="bg-white text-black">
        <CardHeader>
          <CardTitle className="text-xl font-bold">添削結果</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            {proofreadText ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {proofreadText}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-500">添削結果がここに表示されます...</p>
            )}
          </div>
          <Button
            onClick={saveToNotion}
            className="w-full mt-4 bg-primary-green hover:bg-primary-green text-white"
          >
            {isSaveLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />{" "}
                <span>処理中...</span>
              </>
            ) : (
              <span>Notionに保存する</span>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
