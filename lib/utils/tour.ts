/**
 * @file tour.ts
 * @description 관광지 관련 유틸리티 함수
 *
 * 관광지 데이터 변환 및 처리 유틸리티 함수들입니다.
 */

import type { TourDetail, TourItem } from "@/lib/types/tour";

/**
 * TourDetail을 TourItem으로 변환
 * 
 * 북마크 목록에서 TourDetail을 TourItem 형태로 변환하여
 * TourCard 컴포넌트에서 사용할 수 있도록 합니다.
 */
export function tourDetailToItem(detail: TourDetail): TourItem {
  return {
    contentid: detail.contentid,
    contenttypeid: detail.contenttypeid,
    title: detail.title,
    addr1: detail.addr1,
    addr2: detail.addr2,
    areacode: detail.areacode || "",
    mapx: detail.mapx,
    mapy: detail.mapy,
    firstimage: detail.firstimage,
    firstimage2: detail.firstimage2,
    tel: detail.tel,
    zipcode: detail.zipcode,
    modifiedtime: detail.modifiedtime || new Date().toISOString(),
  };
}

