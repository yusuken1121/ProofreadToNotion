import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// エラー表示用コンポーネント
export const ErrorCard = ({ message }: { message: string }) => (
  <Card className="border-red-200 bg-red-50">
    <CardHeader>
      <CardTitle className="text-red-600">エラーが発生しました</CardTitle>
    </CardHeader>
    <CardContent>
      <p>{message}</p>
    </CardContent>
  </Card>
);

// ページ内容なしの表示
export const EmptyStateCard = () => (
  <Card>
    <CardContent className="pt-6">
      <p className="text-center text-muted-foreground">
        質問が見つかりませんでした
      </p>
    </CardContent>
  </Card>
);