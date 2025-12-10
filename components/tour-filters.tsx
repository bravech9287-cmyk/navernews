/**
 * @file tour-filters.tsx
 * @description 관광지 필터 컴포넌트
 *
 * 지역, 관광 타입, 정렬 옵션을 선택할 수 있는 필터 컴포넌트입니다.
 * URL 쿼리 파라미터를 사용하여 필터 상태를 관리합니다.
 *
 * @see {@link /docs/PRD.md} - 필터 요구사항 (2.1장)
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContentTypeName } from "@/lib/types/stats";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TourFiltersProps {
  areas: Array<{ code: string; name: string }>;
  className?: string;
}

export function TourFilters({ areas, className }: TourFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentAreaCode = searchParams.get("areaCode") || "";
  const currentContentTypeId = searchParams.get("contentTypeId") || "";
  const currentArrange = searchParams.get("arrange") || "C";

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // 페이지 번호 초기화
    params.delete("pageNo");

    router.push(`/?${params.toString()}`);
  };

  const handleClearFilters = () => {
    router.push("/");
  };

  const hasActiveFilters =
    currentAreaCode || currentContentTypeId || currentArrange !== "C";

  return (
    <div
      className={cn(
        "space-y-4 p-4 md:p-6 bg-card border rounded-lg shadow-sm",
        className
      )}
      role="region"
      aria-label="관광지 필터"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">필터</h2>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-xs"
          >
            <X className="h-4 w-4 mr-1" />
            필터 초기화
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 지역 필터 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">지역</label>
          <Select
            value={currentAreaCode || "all"}
            onValueChange={(value) => handleFilterChange("areaCode", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="전체 지역" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 지역</SelectItem>
              {areas.map((area) => (
                <SelectItem key={area.code} value={area.code}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 관광 타입 필터 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">관광 타입</label>
          <Select
            value={currentContentTypeId || "all"}
            onValueChange={(value) =>
              handleFilterChange("contentTypeId", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="전체 타입" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 타입</SelectItem>
              {Object.entries(ContentTypeName).map(([id, name]) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 정렬 옵션 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">정렬</label>
          <Select
            value={currentArrange}
            onValueChange={(value) => handleFilterChange("arrange", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="C">최신순</SelectItem>
              <SelectItem value="A">이름순 (가나다)</SelectItem>
              <SelectItem value="B">조회순</SelectItem>
              <SelectItem value="D">생성일순</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

