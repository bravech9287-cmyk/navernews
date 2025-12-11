"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Skip to Content 링크
 * 
 * 키보드 사용자와 스크린 리더 사용자를 위한 접근성 기능입니다.
 * 헤더를 건너뛰고 메인 콘텐츠로 바로 이동할 수 있습니다.
 */
export function SkipToContent() {
  return (
    <Link
      href="#main-content"
      className={cn(
        "absolute left-[-9999px]",
        "focus:left-4 focus:top-4 focus:z-[100]",
        "focus:px-4 focus:py-2",
        "focus:bg-primary focus:text-primary-foreground",
        "focus:rounded-md",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "focus:shadow-lg"
      )}
    >
      메인 콘텐츠로 건너뛰기
    </Link>
  );
}

