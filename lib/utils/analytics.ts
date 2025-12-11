/**
 * @file analytics.ts
 * @description Web Vitals 및 성능 모니터링 유틸리티
 * 
 * Next.js의 Web Vitals를 측정하고 성능 데이터를 수집합니다.
 * 필요시 분석 서비스(Sentry, Google Analytics 등)로 전송할 수 있습니다.
 */

import { ReportHandler } from "web-vitals";

/**
 * Web Vitals 리포트 핸들러
 * 
 * 성능 지표를 콘솔에 출력하거나 분석 서비스로 전송할 수 있습니다.
 */
export function reportWebVitals(metric: Parameters<ReportHandler>[0]) {
  // 프로덕션 환경에서만 성능 데이터 수집
  if (process.env.NODE_ENV === "production") {
    // 콘솔 출력
    console.log("[Web Vitals]", metric);

    // 필요시 분석 서비스로 전송
    // 예: Google Analytics
    // if (typeof window !== "undefined" && (window as any).gtag) {
    //   (window as any).gtag("event", metric.name, {
    //     value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
    //     event_label: metric.id,
    //     non_interaction: true,
    //   });
    // }

    // 예: Sentry
    // if (typeof window !== "undefined" && (window as any).Sentry) {
    //   (window as any).Sentry.metrics.distribution(metric.name, metric.value, {
    //     tags: {
    //       id: metric.id,
    //       rating: metric.rating,
    //     },
    //   });
    // }
  }
}

/**
 * 에러 로깅 유틸리티
 * 
 * 에러를 콘솔에 출력하거나 에러 로깅 서비스로 전송합니다.
 */
export function logError(error: Error, errorInfo?: Record<string, unknown>) {
  console.error("[Error]", error, errorInfo);

  // 필요시 Sentry 등 에러 로깅 서비스로 전송
  // if (typeof window !== "undefined" && (window as any).Sentry) {
  //   (window as any).Sentry.captureException(error, {
  //     extra: errorInfo,
  //   });
  // }
}

