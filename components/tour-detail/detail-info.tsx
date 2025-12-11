/**
 * @file detail-info.tsx
 * @description 관광지 기본 정보 섹션 컴포넌트
 *
 * 관광지 상세페이지의 기본 정보를 표시하는 컴포넌트입니다.
 * 관광지명, 대표 이미지, 주소, 전화번호, 홈페이지, 개요, 타입 뱃지를 표시합니다.
 *
 * 주요 기능:
 * 1. 관광지명 (대제목)
 * 2. 대표 이미지 (크게 표시)
 * 3. 주소 표시 및 복사 기능
 * 4. 전화번호 (클릭 시 전화 연결)
 * 5. 홈페이지 (링크)
 * 6. 개요 (긴 설명문)
 * 7. 관광 타입 및 카테고리 뱃지
 * 8. 정보 없는 항목 숨김 처리
 *
 * @dependencies
 * - @/lib/types/tour: TourDetail 타입
 * - @/lib/types/stats: ContentTypeName
 * - sonner: 토스트 알림
 * - lucide-react: 아이콘
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { TourDetail } from "@/lib/types/tour";
import { ContentTypeName } from "@/lib/types/stats";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  MapPin,
  Phone,
  Globe,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DetailInfoProps {
  detail: TourDetail;
  className?: string;
}

/**
 * 관광지 기본 정보 섹션 컴포넌트
 */
export function DetailInfo({ detail, className }: DetailInfoProps) {
  const [copied, setCopied] = useState(false);

  // 주소 복사 기능
  const handleCopyAddress = async () => {
    const fullAddress = [detail.addr1, detail.addr2]
      .filter(Boolean)
      .join(" ");

    if (!fullAddress) {
      toast.error("복사할 주소가 없습니다.");
      return;
    }

    try {
      // HTTPS 환경 확인
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(fullAddress);
        setCopied(true);
        toast.success("주소가 복사되었습니다!");
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback: 구식 방법
        const textArea = document.createElement("textarea");
        textArea.value = fullAddress;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        toast.success("주소가 복사되었습니다!");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("주소 복사 실패:", error);
      toast.error("주소 복사에 실패했습니다.");
    }
  };

  const imageUrl = detail.firstimage || detail.firstimage2;
  const typeName =
    ContentTypeName[detail.contenttypeid] || "관광지";
  const fullAddress = [detail.addr1, detail.addr2]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={cn("space-y-6", className)}
      aria-label="기본 정보"
    >
      {/* 관광지명 및 타입 */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
            {typeName}
          </span>
          {detail.cat1 && (
            <span className="px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground">
              {detail.cat1}
            </span>
          )}
          {detail.cat2 && (
            <span className="px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground">
              {detail.cat2}
            </span>
          )}
          {detail.cat3 && (
            <span className="px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground">
              {detail.cat3}
            </span>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          {detail.title}
        </h1>
      </div>

      {/* 대표 이미지 */}
      {imageUrl && (
        <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden border bg-muted">
          <Image
            src={imageUrl}
            alt={detail.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            priority
          />
        </div>
      )}

      {/* 주소 */}
      {fullAddress && (
        <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
          <MapPin className="h-5 w-5 mt-0.5 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium mb-1">주소</p>
            <p className="text-muted-foreground break-words">{fullAddress}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyAddress}
            className="shrink-0 gap-2"
            aria-label="주소 복사"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span className="hidden sm:inline">복사됨</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span className="hidden sm:inline">복사</span>
              </>
            )}
          </Button>
        </div>
      )}

      {/* 전화번호 및 홈페이지 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 전화번호 */}
        {detail.tel && (
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
            <Phone className="h-5 w-5 mt-0.5 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium mb-1">전화번호</p>
              <a
                href={`tel:${detail.tel.replace(/[^0-9]/g, "")}`}
                className="text-primary hover:underline break-words"
              >
                {detail.tel}
              </a>
            </div>
          </div>
        )}

        {/* 홈페이지 */}
        {detail.homepage && (
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
            <Globe className="h-5 w-5 mt-0.5 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium mb-1">홈페이지</p>
              <Link
                href={detail.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all flex items-center gap-1 group"
              >
                <span className="truncate">{detail.homepage}</span>
                <ExternalLink className="h-3 w-3 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 개요 */}
      {detail.overview && (
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm font-medium mb-3">개요</p>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {detail.overview}
          </p>
        </div>
      )}
    </section>
  );
}

