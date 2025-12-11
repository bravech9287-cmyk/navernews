/**
 * @file sitemap.ts
 * @description 동적 사이트맵 생성
 *
 * Next.js의 동적 사이트맵 생성 기능을 사용합니다.
 * 정적 페이지와 동적 페이지(관광지 상세페이지)를 포함합니다.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import { MetadataRoute } from "next";
import { getAreaBasedList } from "@/lib/api/tour-api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mytrip.example.com";

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/stats`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bookmarks`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // 동적 페이지: 관광지 상세페이지
  // 주의: 모든 관광지를 가져오면 시간이 오래 걸릴 수 있으므로,
  // 실제로는 인기 관광지나 최근 업데이트된 관광지만 포함하는 것이 좋습니다.
  let dynamicPages: MetadataRoute.Sitemap = [];

  try {
    // 서울 지역의 관광지 샘플 (페이지네이션으로 제한)
    const result = await getAreaBasedList({
      areaCode: "1", // 서울
      contentTypeId: "12", // 관광지
      numOfRows: 100, // 최대 100개만 포함 (사이트맵 크기 제한)
      pageNo: 1,
      arrange: "C", // 최신순
    });

    if (result.items && result.items.length > 0) {
      dynamicPages = result.items.map((tour) => ({
        url: `${baseUrl}/places/${tour.contentid}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    // 에러 발생 시 동적 페이지 없이 정적 페이지만 반환
    console.error("Failed to generate dynamic sitemap:", error);
  }

  return [...staticPages, ...dynamicPages];
}

