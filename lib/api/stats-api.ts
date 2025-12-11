/**
 * @file stats-api.ts
 * @description 통계 대시보드 API 함수
 *
 * 통계 페이지에서 사용하는 데이터를 수집하는 함수들입니다.
 * 지역별, 타입별 관광지 분포 통계를 제공합니다.
 *
 * 주요 기능:
 * 1. 지역별 관광지 개수 집계
 * 2. 타입별 관광지 개수 집계
 * 3. 전체 통계 요약
 *
 * 성능 최적화:
 * - 병렬 API 호출로 성능 최적화
 * - 데이터 캐싱 (revalidate: 3600)
 * - 에러 처리 및 재시도 로직
 *
 * @dependencies
 * - @/lib/api/tour-api: getAreaCode, getAreaBasedList
 * - @/lib/types/stats: RegionStats, TypeStats, StatsSummary, ContentTypeName
 *
 * @see {@link /docs/PRD.md} - 통계 대시보드 요구사항 (2.6장)
 */

import { getAreaCode, getAreaBasedList } from "@/lib/api/tour-api";
import type { RegionStats, TypeStats, StatsSummary } from "@/lib/types/stats";
import { ContentTypeName } from "@/lib/types/stats";

/**
 * 지역별 관광지 개수 집계
 * 
 * 각 시/도별로 관광지 개수를 조회하여 통계를 생성합니다.
 * 병렬 API 호출로 성능을 최적화합니다.
 * 
 * @returns 지역별 통계 배열
 */
export async function getRegionStats(): Promise<RegionStats[]> {
  try {
    // 시/도 목록 조회
    const areas = await getAreaCode();

    // 각 지역별로 병렬로 API 호출
    const statsPromises = areas.map(async (area) => {
      try {
        // 각 지역의 전체 관광지 개수 조회 (numOfRows=1로 최소한의 데이터만 가져옴)
        const response = await getAreaBasedList({
          areaCode: area.code,
          numOfRows: 1,
          pageNo: 1,
        });

        return {
          code: area.code,
          name: area.name,
          count: response.totalCount,
        } as RegionStats;
      } catch (error) {
        console.error(`지역 ${area.name} (${area.code}) 통계 조회 실패:`, error);
        // 에러가 발생해도 0으로 처리하여 계속 진행
        return {
          code: area.code,
          name: area.name,
          count: 0,
        } as RegionStats;
      }
    });

    // 모든 지역 통계를 병렬로 수집
    const stats = await Promise.all(statsPromises);

    // 개수 기준으로 내림차순 정렬
    return stats.sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error("지역별 통계 조회 실패:", error);
    throw error;
  }
}

/**
 * 타입별 관광지 개수 집계
 * 
 * 각 관광 타입별로 관광지 개수를 조회하여 통계를 생성합니다.
 * 병렬 API 호출로 성능을 최적화합니다.
 * 
 * @returns 타입별 통계 배열
 */
export async function getTypeStats(): Promise<TypeStats[]> {
  try {
    // 관광 타입 목록 (ContentTypeName의 키들)
    const contentTypeIds = Object.keys(ContentTypeName);

    // 각 타입별로 병렬로 API 호출
    const statsPromises = contentTypeIds.map(async (contentTypeId) => {
      try {
        // 각 타입의 전체 관광지 개수 조회 (numOfRows=1로 최소한의 데이터만 가져옴)
        const response = await getAreaBasedList({
          contentTypeId,
          numOfRows: 1,
          pageNo: 1,
        });

        return {
          contentTypeId,
          typeName: ContentTypeName[contentTypeId],
          count: response.totalCount,
          percentage: 0, // 나중에 계산
        } as TypeStats;
      } catch (error) {
        console.error(
          `타입 ${ContentTypeName[contentTypeId]} (${contentTypeId}) 통계 조회 실패:`,
          error
        );
        // 에러가 발생해도 0으로 처리하여 계속 진행
        return {
          contentTypeId,
          typeName: ContentTypeName[contentTypeId],
          count: 0,
          percentage: 0,
        } as TypeStats;
      }
    });

    // 모든 타입 통계를 병렬로 수집
    const stats = await Promise.all(statsPromises);

    // 전체 관광지 수 계산
    const totalCount = stats.reduce((sum, stat) => sum + stat.count, 0);

    // 비율 계산 및 정렬
    const statsWithPercentage = stats
      .map((stat) => ({
        ...stat,
        percentage: totalCount > 0 ? (stat.count / totalCount) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return statsWithPercentage;
  } catch (error) {
    console.error("타입별 통계 조회 실패:", error);
    throw error;
  }
}

/**
 * 전체 통계 요약
 * 
 * 지역별 및 타입별 통계를 조회하여 요약 정보를 생성합니다.
 * 
 * @returns 통계 요약 정보
 */
export async function getStatsSummary(): Promise<StatsSummary> {
  try {
    // 지역별 및 타입별 통계를 병렬로 조회
    const [regionStats, typeStats] = await Promise.all([
      getRegionStats(),
      getTypeStats(),
    ]);

    // 전체 관광지 수 계산 (타입별 통계의 합계)
    const totalCount = typeStats.reduce((sum, stat) => sum + stat.count, 0);

    // Top 3 지역 추출
    const topRegions = regionStats.slice(0, 3);

    // Top 3 타입 추출
    const topTypes = typeStats.slice(0, 3);

    return {
      totalCount,
      topRegions,
      topTypes,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error("통계 요약 조회 실패:", error);
    throw error;
  }
}

