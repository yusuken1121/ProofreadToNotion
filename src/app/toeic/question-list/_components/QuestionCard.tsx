import { format } from "date-fns";
import { ToeicQuestionItem } from "@/types/Toeic.Type";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageContent } from "./ContentRenderers";

// 日付フォーマット用ヘルパー関数
export const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "yyyy年MM月dd日 HH:mm");
  } catch {
    return dateString;
  }
};

// 質問カード表示コンポーネント
export const QuestionCard = ({
  question,
  pendingUpdates,
  onUpdateCheckbox,
}: {
  question: ToeicQuestionItem;
  pendingUpdates: Set<string>;
  onUpdateCheckbox: (pageId: string, completed: boolean) => Promise<void>;
}) => {
  return (
    <Card
      className={cn(
        "flex flex-col h-full transition-colors",
        question.completed ? "border-green-200 bg-green-50/50" : ""
      )}
    >
      <CardHeader className="relative pb-2">
        <div className="absolute right-4 top-4">
          <Checkbox
            id={`checkbox-${question.id}`}
            checked={question.completed}
            disabled={pendingUpdates.has(question.id)}
            onCheckedChange={(checked) => {
              onUpdateCheckbox(question.id, checked === true);
            }}
            aria-label="できるようになったかどうか"
          />
        </div>
        <CardTitle className="text-lg pr-8">
          {question.sentence || "（文章なし）"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {question.pageContent && question.pageContent.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="content">
              <AccordionTrigger className="text-sm font-medium">
                ページの内容を表示
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-2 space-y-3">
                  <PageContent content={question.pageContent} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <p className="text-sm text-muted-foreground break-all line-clamp-3">
            {question.sentence || "文章内容がありません"}
          </p>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <div className="w-full flex flex-col gap-1">
          <Separator />
          <div className="pt-1 flex justify-between items-center">
            <div>作成日: {formatDate(question.createdTime)}</div>
            {question.completed && (
              <span className="text-green-600 font-medium">
                できるようになった
              </span>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
