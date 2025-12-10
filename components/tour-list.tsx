/**
 * @file tour-list.tsx
 * @description 관광지 목록 컴포넌트
 *
 * 관광지 목록을 그리드 레이아웃으로 표시하는 컴포넌트입니다.
 * 로딩 상태, 빈 상태, 에러 상태를 처리합니다.
 *
 * @see {@link /docs/PRD.md} - 관광지 목록 요구사항 (2.1장)
 */

import type { TourItem } from "@/lib/types/tour";
import { TourCard } from "@/components/tour-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Error } from "@/components/ui/error";
import { cn } from "@/lib/utils";

interface TourListProps {
  tours: TourItem[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  className?: string;
}

export function TourList({
  tours,
  isLoading = false,
  error = null,
  onRetry,
  className,
}: TourListProps) {
  // 로딩 상태
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
          className
        )}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="w-full h-48 rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Error
        message={error.message || "관광지 목록을 불러오는 중 오류가 발생했습니다."}
        onRetry={onRetry}
      />
    );
  }

  // 빈 상태
  if (tours.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-muted-foreground mb-2">
          관광지가 없습니다.
        </p>
        <p className="text-sm text-muted-foreground">
          다른 필터 조건을 선택해보세요.
        </p>
      </div>
    );
  }

  // 목록 표시
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
    >
      {tours.map((tour) => (
        <TourCard key={tour.contentid} tour={tour} />
      ))}
    </div>
  );
}

