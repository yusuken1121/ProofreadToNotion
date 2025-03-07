import { cn } from "@/lib/utils";
import { ContentBlock, RichText } from "./types";

// リッチテキスト表示コンポーネント
export const RichTextSpan = ({ text }: { text: RichText }) => (
  <span
    className={cn(
      text.annotations?.bold && "font-bold",
      text.annotations?.italic && "italic",
      text.annotations?.underline && "underline",
      text.annotations?.strikethrough && "line-through",
      text.annotations?.code && "font-mono bg-slate-100 px-1 rounded"
    )}
  >
    {text.plain_text}
  </span>
);

// ページ内容を表示するコンポーネント
export const PageContent = ({ content }: { content: ContentBlock[] }) => {
  if (!content || !Array.isArray(content) || content.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        コンテンツがありません
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {content.map((block, index) => (
        <BlockContent key={index} block={block} index={index} />
      ))}
    </div>
  );
};

// 各ブロックタイプごとの表示コンポーネント
export const BlockContent = ({ block, index }: { block: ContentBlock; index: number }) => {
  switch (block.type) {
    case "paragraph":
      return (
        <div className="text-sm">
          {block.content?.rich_text?.map((text, i) => (
            <RichTextSpan key={i} text={text} />
          )) || "空のパラグラフ"}
        </div>
      );

    case "heading_1":
    case "heading_2":
    case "heading_3":
      const headingSize: Record<string, string> = {
        heading_1: "text-xl font-bold",
        heading_2: "text-lg font-bold",
        heading_3: "text-base font-bold",
      };

      return (
        <div className={headingSize[block.type]}>
          {block.content?.rich_text?.map((text, i) => (
            <span key={i}>{text.plain_text}</span>
          )) || "見出し"}
        </div>
      );

    case "bulleted_list_item":
    case "numbered_list_item":
      return (
        <div className="flex">
          <span className="mr-2">
            {block.type === "bulleted_list_item"
              ? "•"
              : `${index + 1}.`}
          </span>
          <span>
            {block.content?.rich_text?.map((text, i) => (
              <span key={i}>{text.plain_text}</span>
            )) || "リストアイテム"}
          </span>
        </div>
      );

    default:
      return (
        <div className="text-xs text-gray-500">
          {`[${block.type}ブロック]`}
        </div>
      );
  }
};