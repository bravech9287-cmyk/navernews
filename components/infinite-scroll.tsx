/**
 * @file infinite-scroll.tsx
 * @description 무한 스크롤 컴포넌트
 *
 * Intersection Observer를 사용하여 하단에 도달하면 다음 페이지를 자동으로 로드합니다.
 * 하단 로딩 인디케이터를 표시합니다.
 *
 * @see {@link /docs/PRD.md} - 페이지네이션 요구사항 (2.1장)
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfiniteScrollProps {
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
  isLoading: boolean;
  className?: string;
}

export function InfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  className,
}: InfiniteScrollProps) {
  const observerTarget = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsIntersecting(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "100px", // 100px 전에 미리 로드
        threshold: 0.1,
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, []);

  useEffect(() => {
    if (isIntersecting && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [isIntersecting, hasMore, isLoading, onLoadMore]);

  if (!hasMore) {
    return null;
  }

  return (
    <div
      ref={observerTarget}
      className={cn("flex items-center justify-center py-8", className)}
    >
      {isLoading && (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">더 많은 관광지를 불러오는 중...</p>
        </div>
      )}
    </div>
  );
}

