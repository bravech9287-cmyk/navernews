/**
 * @file coordinate.ts
 * @description 좌표 변환 유틸리티
 *
 * 한국관광공사 API의 KATEC 좌표계를 네이버 지도가 사용하는 WGS84 좌표계로 변환합니다.
 *
 * 변환 공식: KATEC 좌표 / 10000000 = WGS84 좌표
 */

/**
 * KATEC 좌표를 WGS84 좌표로 변환
 * @param katecCoord KATEC 좌표 (정수형 문자열)
 * @returns WGS84 좌표 (소수점)
 */
export function katecToWgs84(katecCoord: string): number {
  const coord = parseFloat(katecCoord);
  if (isNaN(coord)) {
    return 0;
  }
  return coord / 10000000;
}

/**
 * 관광지의 좌표를 WGS84로 변환
 * @param mapx 경도 (KATEC)
 * @param mapy 위도 (KATEC)
 * @returns [경도, 위도] (WGS84)
 */
export function convertTourCoordinates(
  mapx: string,
  mapy: string
): [number, number] {
  return [katecToWgs84(mapx), katecToWgs84(mapy)];
}

