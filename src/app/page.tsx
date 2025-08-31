import { EnglishReviseForm } from "@/components/english-revise-form";
import FeatureCard from "@/components/home/featureCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteLinks } from "@/config/siteLinks";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-full">
      <div className="w-full container p-4 mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>AIを活用したプチ英語ツール</CardTitle>
            <CardDescription>
              下記より使用する機能をお選びください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {siteLinks.map((link) => (
                <div
                  className="flex items-center justify-center"
                  key={link.label}
                >
                  <FeatureCard label={link.label} href={link.href} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
