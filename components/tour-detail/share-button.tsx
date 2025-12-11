/**
 * @file share-button.tsx
 * @description 공유 버튼 컴포넌트
 *
 * 관광지 상세페이지의 URL을 클립보드에 복사하는 기능을 제공합니다.
 *
 * 주요 기능:
 * 1. URL 복사 기능 (클립보드 API)
 * 2. 복사 완료 토스트 메시지
 * 3. 공유 아이콘 버튼
 *
 * @dependencies
 * - navigator.clipboard: 클립보드 API
 * - sonner: 토스트 알림
 * - lucide-react: 아이콘
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Share2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  url?: string;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "sm" | "default" | "lg" | "icon";
}

/**
 * 공유 버튼 컴포넌트
 */
export function ShareButton({
  url,
  className,
  variant = "outline",
  size = "default",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  // 현재 페이지 URL 가져오기 (url prop이 없으면 현재 URL 사용)
  const getCurrentUrl = () => {
    if (url) {
      return url;
    }
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  };

  // URL 복사 기능
  const handleShare = async () => {
    const shareUrl = getCurrentUrl();

    if (!shareUrl) {
      toast.error("공유할 URL을 찾을 수 없습니다.");
      return;
    }

    try {
      // HTTPS 환경 확인
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("링크가 복사되었습니다!");
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback: 구식 방법
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        toast.success("링크가 복사되었습니다!");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("URL 복사 실패:", error);
      toast.error("링크 복사에 실패했습니다.");
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      className={cn("gap-2", className)}
      aria-label={copied ? "링크가 복사되었습니다" : "링크 공유"}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          <span className="hidden sm:inline">복사됨</span>
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">공유</span>
        </>
      )}
    </Button>
  );
}

