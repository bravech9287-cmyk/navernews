/**
 * @file tour-card.tsx
 * @description 관광지 카드 컴포넌트
 *
 * 관광지 목록에서 각 관광지를 표시하는 카드 컴포넌트입니다.
 * 썸네일 이미지, 관광지명, 주소, 타입 뱃지, 간단한 개요를 표시합니다.
 *
 * @see {@link /docs/PRD.md} - 관광지 목록 요구사항 (2.1장)
 * @see {@link /docs/Design.md} - 카드 디자인 가이드
 */

import Link from "next/link";
import Image from "next/image";
import type { TourItem } from "@/lib/types/tour";
import { ContentTypeName } from "@/lib/types/stats";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface TourCardProps {
  tour: TourItem;
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export function TourCard({
  tour,
  className,
  onClick,
  isSelected = false,
}: TourCardProps) {
  const imageUrl = tour.firstimage || tour.firstimage2;
  const typeName = ContentTypeName[tour.contenttypeid] || "관광지";
  const address = tour.addr1 || "주소 정보 없음";

  return (
    <Link
      href={`/places/${tour.contentid}`}
      onClick={(e) => {
        // onClick이 있으면 onClick 실행 (링크 이동은 그대로)
        if (onClick) {
          onClick();
        }
      }}
      className={cn(
        "group block bg-card rounded-xl shadow-md border overflow-hidden",
        "hover:shadow-xl hover:scale-[1.02] transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        isSelected
          ? "border-primary shadow-lg ring-2 ring-primary ring-offset-2"
          : "border-border hover:border-primary/50",
        className
      )}
      aria-label={`${tour.title} 상세보기`}
    >
      {/* 썸네일 이미지 */}
      <div className="relative w-full h-48 bg-muted overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={tour.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
            <MapPin className="h-12 w-12" />
          </div>
        )}
      </div>

      {/* 카드 내용 */}
      <div className="p-4 space-y-3">
        {/* 관광 타입 뱃지 */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {typeName}
          </span>
        </div>

        {/* 관광지명 */}
        <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {tour.title}
        </h3>

        {/* 주소 */}
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
          <span className="line-clamp-1">{address}</span>
        </div>
      </div>
    </Link>
  );
}

