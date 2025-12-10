/**
 * @file toast.tsx
 * @description 토스트 알림 컴포넌트 (sonner 기반)
 *
 * shadcn/ui의 sonner를 사용한 토스트 알림 컴포넌트입니다.
 * layout.tsx에 <Toaster />를 추가하여 사용합니다.
 *
 * @example
 * import { toast } from "sonner";
 * toast.success("성공했습니다!");
 * toast.error("오류가 발생했습니다.");
 */

"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        style: {
          background: "hsl(var(--background))",
          border: "1px solid hsl(var(--border))",
          color: "hsl(var(--foreground))",
        },
      }}
    />
  );
}

// toast 함수를 직접 export하여 사용 편의성 제공
export { toast } from "sonner";

