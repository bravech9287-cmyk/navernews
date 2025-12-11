"use client";

import { useEffect } from "react";

/**
 * Service Worker 등록 컴포넌트
 * 
 * PWA를 위한 Service Worker를 등록합니다.
 * 클라이언트 사이드에서만 실행되므로 'use client' 지시어를 사용합니다.
 */
export function ServiceWorkerProvider() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  return null;
}

