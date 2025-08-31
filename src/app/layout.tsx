import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header/Header";
import { Breadcrumbs } from "@/components/BreadCrumbs";
import { siteLinks } from "@/config/siteLinks";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AIを活用した英語添削ツール",
  description:
    "英語の文章をより良くするための多機能な添削ツールです。文章表現（カジュアル、フォーマル、ノーマル）をカスタマイズし、誤りのレベルを調整できます。文法、語彙、使い方に焦点を当てた添削も可能。修正前と修正後の文章をNotionに保存できます。",
  icons: "./public/icon.jpg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="h-lvh grid grid-rows-[64px_64px_1fr] bg-background">
          <Header />
          <div className="container mx-auto flex items-center p-4">
            <Breadcrumbs segments={siteLinks} />
          </div>
          <main className="container mx-auto p-4">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
