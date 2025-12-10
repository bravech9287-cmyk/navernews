/**
 * @file skeleton.tsx
 * @description 스켈레톤 UI 컴포넌트
 *
 * 데이터 로딩 중 콘텐츠의 형태를 미리 보여주는 스켈레톤 컴포넌트입니다.
 * shadcn/ui 스타일을 따릅니다.
 */

import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };

