/**
 * @file stats.ts
 * @description 통계 대시보드 데이터 타입 정의
 *
 * 이 파일은 통계 페이지에서 사용하는 데이터 타입을 정의합니다.
 * 지역별, 타입별 관광지 분포 통계 및 요약 정보를 포함합니다.
 *
 * @see {@link /docs/PRD.md} - 통계 대시보드 요구사항 (2.6장)
 */

/**
 * 지역별 통계
 */
export interface RegionStats {
  code: string; // 지역코드
  name: string; // 지역명 (서울, 부산, 제주 등)
  count: number; // 관광지 개수
}

/**
 * 타입별 통계
 */
export interface TypeStats {
  contentTypeId: string; // 콘텐츠타입ID (12, 14, 15, 25, 28, 32, 38, 39)
  typeName: string; // 타입명 (관광지, 문화시설, 축제/행사 등)
  count: number; // 관광지 개수
  percentage: number; // 비율 (백분율)
}

/**
 * 통계 요약 정보
 */
export interface StatsSummary {
  totalCount: number; // 전체 관광지 수
  topRegions: RegionStats[]; // Top 3 지역
  topTypes: TypeStats[]; // Top 3 타입
  lastUpdated: Date; // 마지막 업데이트 시간
}

/**
 * Content Type ID와 타입명 매핑
 */
export const ContentTypeName: Record<string, string> = {
  "12": "관광지",
  "14": "문화시설",
  "15": "축제/행사",
  "25": "여행코스",
  "28": "레포츠",
  "32": "숙박",
  "38": "쇼핑",
  "39": "음식점",
} as const;

