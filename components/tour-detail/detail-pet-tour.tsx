/**
 * @file detail-pet-tour.tsx
 * @description 반려동물 정보 섹션 컴포넌트
 *
 * 관광지 상세페이지의 반려동물 동반 여행 정보를 표시하는 컴포넌트입니다.
 *
 * 주요 기능:
 * 1. 반려동물 동반 가능 여부 표시
 * 2. 반려동물 크기 제한 정보
 * 3. 반려동물 입장 가능 장소 (실내/실외)
 * 4. 반려동물 동반 추가 요금
 * 5. 반려동물 전용 시설 정보
 * 6. 아이콘 및 뱃지 디자인
 * 7. 주의사항 강조 표시
 *
 * @dependencies
 * - @/lib/types/tour: PetTourInfo 타입
 * - lucide-react: 아이콘
 */

"use client";

import type { PetTourInfo } from "@/lib/types/tour";
import {
  Dog,
  Info,
  DollarSign,
  MapPin,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DetailPetTourProps {
  petInfo: PetTourInfo;
  className?: string;
}

/**
 * 정보 항목을 표시하는 헬퍼 컴포넌트
 */
function PetInfoItem({
  icon: Icon,
  label,
  value,
  type = "info",
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  type?: "info" | "success" | "warning" | "error";
  className?: string;
}) {
  const typeStyles = {
    info: "text-primary",
    success: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    error: "text-red-600 dark:text-red-400",
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border bg-card",
        className
      )}
    >
      <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", typeStyles[type])} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium mb-1">{label}</p>
        <p className="text-muted-foreground whitespace-pre-wrap break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

/**
 * 반려동물 정보 섹션 컴포넌트
 */
export function DetailPetTour({ petInfo, className }: DetailPetTourProps) {
  const hasInfo = Boolean(
    petInfo.chkpetleash ||
      petInfo.chkpetsize ||
      petInfo.chkpetplace ||
      petInfo.chkpetfee ||
      petInfo.petinfo ||
      petInfo.parking
  );

  if (!hasInfo) {
    return null;
  }

  // 반려동물 동반 가능 여부 확인
  const isPetAllowed = petInfo.chkpetleash
    ?.toLowerCase()
    .includes("가능") || petInfo.chkpetleash?.toLowerCase().includes("yes");

  return (
    <section className={cn("space-y-6", className)} aria-label="반려동물 정보">
      <div className="flex items-center gap-2">
        <Dog className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">반려동물 동반 정보</h2>
      </div>

      {/* 반려동물 동반 가능 여부 (강조 표시) */}
      {petInfo.chkpetleash && (
        <div
          className={cn(
            "flex items-center gap-3 p-4 rounded-lg border-2",
            isPetAllowed
              ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
          )}
        >
          {isPetAllowed ? (
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 shrink-0" />
          ) : (
            <XCircle className="h-6 w-6 text-red-600 dark:text-red-400 shrink-0" />
          )}
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">반려동물 동반 가능 여부</p>
            <p
              className={cn(
                "font-semibold",
                isPetAllowed
                  ? "text-green-700 dark:text-green-300"
                  : "text-red-700 dark:text-red-300"
              )}
            >
              {petInfo.chkpetleash}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 반려동물 크기 제한 */}
        {petInfo.chkpetsize && (
          <PetInfoItem
            icon={Dog}
            label="반려동물 크기 제한"
            value={petInfo.chkpetsize}
            type="info"
          />
        )}

        {/* 입장 가능 장소 */}
        {petInfo.chkpetplace && (
          <PetInfoItem
            icon={MapPin}
            label="입장 가능 장소"
            value={petInfo.chkpetplace}
            type="info"
          />
        )}

        {/* 추가 요금 */}
        {petInfo.chkpetfee && (
          <PetInfoItem
            icon={DollarSign}
            label="반려동물 동반 추가 요금"
            value={petInfo.chkpetfee}
            type="warning"
          />
        )}

        {/* 주차장 정보 */}
        {petInfo.parking && (
          <PetInfoItem
            icon={MapPin}
            label="주차장 정보"
            value={petInfo.parking}
            type="info"
          />
        )}
      </div>

      {/* 기타 반려동물 정보 */}
      {petInfo.petinfo && (
        <div className="p-4 rounded-lg border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 mt-0.5 text-yellow-600 dark:text-yellow-400 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-2 text-yellow-800 dark:text-yellow-200">
                주의사항 및 기타 정보
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 whitespace-pre-wrap break-words">
                {petInfo.petinfo}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

