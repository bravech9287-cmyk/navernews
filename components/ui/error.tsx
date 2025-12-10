/**
 * @file error.tsx
 * @description 에러 메시지 컴포넌트
 *
 * API 에러나 기타 에러를 표시하는 컴포넌트입니다.
 * 재시도 버튼을 포함할 수 있습니다.
 */

"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
  title?: string;
}

export function Error({
  message = "오류가 발생했습니다.",
  onRetry,
  className,
  title = "오류",
}: ErrorProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-8 rounded-lg border border-destructive/50 bg-destructive/10",
        className
      )}
    >
      <AlertCircle className="h-12 w-12 text-destructive" />
      <div className="text-center">
        <h3 className="text-lg font-semibold text-destructive mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          다시 시도
        </Button>
      )}
    </div>
  );
}

