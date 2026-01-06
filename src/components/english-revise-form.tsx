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
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useDebouncedCallback } from "use-debounce";
import { reviseTextAction } from "@/app/_actions/proofread";

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

  // 打ち終わったあとあるタイミングでlocalstorageに保存する
  const watchDiaryEntry = form.watch("diaryEntry");
  const debounced = useDebouncedCallback((value) => {
    localStorage.setItem("text", value);
    toast.success("フォームデータが自動保存されました。");
  }, 1000);

  useEffect(() => {
    debounced(watchDiaryEntry);
  }, [watchDiaryEntry, debounced]);

  //
  useEffect(() => {
    const savedText = localStorage.getItem("text");
    if (savedText) {
      form.setValue("diaryEntry", savedText);
      toast.info("保存されたデータを読み込みました。");
    }
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsProofLoading(true);
    try {
      const text = await reviseTextAction({
        text: values.diaryEntry,
        writingStyle: values.writingStyle,
        errorLevel: values.errorLevel,
        errorTypes: values.errorTypes as any,
      });
      setProofreadText(text);
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
      localStorage.removeItem("text");
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
    <div className="w-full space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
      <div className="space-y-6">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">英語添削ツール</CardTitle>
            <CardDescription>
              英語で書いて、AIに添削してもらいましょう
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="diaryEntry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>日記</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your diary entry here..."
                          className="min-h-[300px] text-base leading-relaxed resize-y font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>英語で書いてください</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              <FormLabel className="font-normal cursor-pointer">
                                Casual
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="formal" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Formal
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="normal" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Normal
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-6">
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="errorTypes"
                      render={() => (
                        <FormItem>
                          <FormLabel>誤りの種類</FormLabel>
                          <div className="grid grid-cols-1 gap-2">
                            {errorTypeItems.map((item) => (
                              <FormField
                                key={item.id}
                                control={form.control}
                                name="errorTypes"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={item.id}
                                      className="flex flex-row items-center space-x-3 space-y-0"
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
                                      <FormLabel className="font-normal cursor-pointer">
                                        {item.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 text-lg transition-all"
                  disabled={isProofLoading}
                >
                  {isProofLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Proofread Text</span>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Card className="h-full flex flex-col sticky top-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              添削結果
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-[400px]">
            <div className="prose dark:prose-invert max-w-none flex-1 overflow-y-auto">
              {proofreadText ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {proofreadText}
                </ReactMarkdown>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
                  <p>修正されたテキストがここに表示されます</p>
                </div>
              )}
            </div>

            {proofreadText && (
              <div className="pt-6 mt-auto">
                <Button
                  onClick={saveToNotion}
                  className="w-full"
                  variant="default"
                  disabled={isSaveLoading}
                >
                  {isSaveLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save to Notion</span>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
