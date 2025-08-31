"use client";

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ onCategoryChange }: CategoryFilterProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/business-english/categories");
        if (!response.ok) {
          throw new Error("カテゴリーの取得に失敗しました。");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="mb-4">
      <Select onValueChange={onCategoryChange} defaultValue="all">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="カテゴリー" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべてのカテゴリー</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
