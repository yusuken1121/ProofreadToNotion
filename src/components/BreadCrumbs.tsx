"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { siteLinks } from "@/config/siteLinks";
import { usePathname } from "next/navigation";
import React from "react";

// パスの各セグメントを表す型定義
type BreadcrumbSegment = {
  label: string;
  href: string;
};

interface BreadcrumbsProps {
  segments: BreadcrumbSegment[];
}

export function Breadcrumbs({ segments }: BreadcrumbsProps) {
  // クライアントサイドレンダリング用の状態
  const pathname = usePathname();

  const currentIndex = siteLinks.findIndex((link) => link.href === pathname);
  const newSegments: BreadcrumbSegment[] =
    currentIndex >= 0 ? siteLinks.slice(0, currentIndex + 1) : [siteLinks[0]];
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {newSegments.map((segment, index) => (
          <React.Fragment key={segment.href}>
            <BreadcrumbItem>
              {index === segments.length - 1 ? (
                <BreadcrumbPage>{segment.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={segment.href}>
                  {segment.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < segments.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
