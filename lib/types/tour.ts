/**
 * @file tour.ts
 * @description 한국관광공사 공공 API(KorService2) 응답 데이터 타입 정의
 *
 * 이 파일은 한국관광공사 API의 모든 응답 타입을 정의합니다.
 * PRD.md 5장의 데이터 구조를 기반으로 작성되었습니다.
 *
 * @see {@link /docs/PRD.md} - API 명세 및 데이터 구조
 */

/**
 * 관광지 목록 항목 (areaBasedList2, searchKeyword2 응답)
 */
export interface TourItem {
  addr1: string; // 주소
  addr2?: string; // 상세주소
  areacode: string; // 지역코드
  contentid: string; // 콘텐츠ID
  contenttypeid: string; // 콘텐츠타입ID
  title: string; // 제목
  mapx: string; // 경도 (KATEC 좌표계, 정수형)
  mapy: string; // 위도 (KATEC 좌표계, 정수형)
  firstimage?: string; // 대표이미지1
  firstimage2?: string; // 대표이미지2
  tel?: string; // 전화번호
  cat1?: string; // 대분류
  cat2?: string; // 중분류
  cat3?: string; // 소분류
  modifiedtime: string; // 수정일
  createdtime?: string; // 생성일
  booktour?: string; // 예약정보
  mlevel?: string; // 맵레벨
  sigungucode?: string; // 시군구코드
  zipcode?: string; // 우편번호
}

/**
 * 상세 정보 (detailCommon2 응답)
 */
export interface TourDetail {
  contentid: string;
  contenttypeid: string;
  title: string;
  addr1: string;
  addr2?: string;
  zipcode?: string;
  tel?: string;
  homepage?: string;
  overview?: string; // 개요 (긴 설명)
  firstimage?: string;
  firstimage2?: string;
  mapx: string; // 경도
  mapy: string; // 위도
  createdtime?: string;
  modifiedtime?: string;
  telname?: string; // 전화번호명
  cat1?: string; // 대분류
  cat2?: string; // 중분류
  cat3?: string; // 소분류
  cpyrhtDivCd?: string; // 저작권
  booktour?: string; // 예약정보
}

/**
 * 운영 정보 (detailIntro2 응답)
 * 타입별로 필드가 다르므로 모든 가능한 필드를 optional로 정의
 */
export interface TourIntro {
  contentid: string;
  contenttypeid: string;
  // 공통 필드
  usetime?: string; // 이용시간
  restdate?: string; // 휴무일
  infocenter?: string; // 문의처
  parking?: string; // 주차 가능
  chkpet?: string; // 반려동물 동반
  // 관광지(12) 관련
  expguide?: string; // 체험안내
  expagerange?: string; // 체험가능연령
  // 문화시설(14) 관련
  usefee?: string; // 이용요금
  usetimeculture?: string; // 관람시간
  restdateculture?: string; // 휴무일
  // 축제/행사(15) 관련
  playtime?: string; // 공연시간
  eventstartdate?: string; // 행사시작일
  eventenddate?: string; // 행사종료일
  eventplace?: string; // 행사장소
  eventhomepage?: string; // 행사홈페이지
  // 여행코스(25) 관련
  distance?: string; // 코스거리
  taketime?: string; // 소요시간
  // 레포츠(28) 관련
  usefeeleports?: string; // 입장료
  usetimeleports?: string; // 이용시간
  // 숙박(32) 관련
  roomcount?: string; // 객실수
  roomtype?: string; // 객실유형
  refundregulation?: string; // 환불규정
  // 쇼핑(38) 관련
  opentime?: string; // 영업시간
  restdateshopping?: string; // 휴무일
  shopguide?: string; // 쇼핑안내
  // 음식점(39) 관련
  opentimefood?: string; // 영업시간
  restdatefood?: string; // 휴무일
  treatmenu?: string; // 대표메뉴
  firstmenu?: string; // 주메뉴
  reservationfood?: string; // 예약안내
  lcnsno?: string; // 인허가번호
}

/**
 * 이미지 정보 (detailImage2 응답)
 */
export interface TourImage {
  contentid: string;
  originimgurl: string; // 원본 이미지 URL
  serialnum: string; // 이미지 일련번호
  smallimageurl?: string; // 썸네일 이미지 URL
  cpyrhtDivCd?: string; // 저작권
}

/**
 * 반려동물 정보 (detailPetTour2 응답)
 */
export interface PetTourInfo {
  contentid: string;
  contenttypeid: string;
  chkpetleash?: string; // 애완동물 동반 여부
  chkpetsize?: string; // 애완동물 크기
  chkpetplace?: string; // 입장 가능 장소
  chkpetfee?: string; // 추가 요금
  petinfo?: string; // 기타 반려동물 정보
  parking?: string; // 주차장 정보
}

/**
 * 지역 코드 정보 (areaCode2 응답)
 */
export interface AreaCode {
  code: string; // 지역코드
  name: string; // 지역명
  rnum?: number; // 순번
}

/**
 * API 응답 래퍼 타입
 * 한국관광공사 API는 response.body.response.body.items.item 구조를 사용
 */
export interface ApiResponse<T> {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items?: {
        item: T | T[];
      };
      numOfRows?: number;
      pageNo?: number;
      totalCount?: number;
    };
  };
}

/**
 * API 에러 응답
 */
export interface ApiErrorResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body?: {
      items?: {
        item?: unknown;
      };
    };
  };
}

/**
 * Content Type ID (관광 타입)
 */
export const ContentTypeId = {
  TOURIST_SPOT: "12", // 관광지
  CULTURAL_FACILITY: "14", // 문화시설
  FESTIVAL: "15", // 축제/행사
  TOUR_COURSE: "25", // 여행코스
  LEISURE_SPORTS: "28", // 레포츠
  ACCOMMODATION: "32", // 숙박
  SHOPPING: "38", // 쇼핑
  RESTAURANT: "39", // 음식점
} as const;

export type ContentTypeIdValue =
  (typeof ContentTypeId)[keyof typeof ContentTypeId];

