import { reportWebVitals } from "@/lib/utils/analytics";

/**
 * Web Vitals 리포트 설정
 * 
 * Next.js가 자동으로 호출하는 파일입니다.
 * 성능 지표를 수집하고 리포트합니다.
 */
export function onPerfEntry(entry: Parameters<typeof reportWebVitals>[0]) {
  reportWebVitals(entry);
}

