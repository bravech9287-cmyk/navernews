/**
 * @file tour-search.tsx
 * @description 관광지 검색 컴포넌트
 *
 * 키워드로 관광지를 검색하는 컴포넌트입니다.
 * URL 쿼리 파라미터를 사용하여 검색 상태를 관리합니다.
 *
 * @see {@link /docs/PRD.md} - 검색 기능 요구사항 (2.3장)
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TourSearchProps {
  className?: string;
  variant?: "navbar" | "hero";
}

export function TourSearch({ className, variant = "navbar" }: TourSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [isPending, startTransition] = useTransition();

  const handleSearch = () => {
    if (!keyword.trim()) {
      // 키워드가 없으면 검색 파라미터 제거
      const params = new URLSearchParams(searchParams.toString());
      params.delete("keyword");
      params.delete("pageNo");
      router.push(`/?${params.toString()}`);
      return;
    }

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("keyword", keyword.trim());
      params.delete("pageNo"); // 페이지 번호 초기화
      router.push(`/?${params.toString()}`);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (variant === "navbar") {
    return (
      <div className={cn("hidden lg:flex items-center gap-2", className)}>
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="관광지 검색..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9 pr-10 w-48 md:w-64"
          />
          {isPending && (
            <Loader2 className="absolute right-3 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <Button
          onClick={handleSearch}
          size="sm"
          disabled={isPending}
          className="shrink-0"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }

  // Hero variant (메인 영역에 큰 검색창)
  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="관광지명, 주소, 설명으로 검색..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-12 pr-4 py-6 text-base h-auto shadow-lg"
          />
          {isPending && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
          )}
        </div>
        <Button
          onClick={handleSearch}
          size="lg"
          disabled={isPending}
          className="px-8 py-6 h-auto shadow-lg"
        >
          {isPending ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              검색 중...
            </>
          ) : (
            <>
              <Search className="h-5 w-5 mr-2" />
              검색
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

