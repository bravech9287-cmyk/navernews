/**
 * @file robots.ts
 * @description robots.txt 생성
 *
 * 검색 엔진 크롤러를 위한 robots.txt 파일을 동적으로 생성합니다.
 * 사이트맵 위치와 크롤링 규칙을 정의합니다.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mytrip.example.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/", // API 라우트는 크롤링 제외
          "/auth-test/", // 테스트 페이지 제외
          "/supabase-test/", // 테스트 페이지 제외
          "/storage-test/", // 테스트 페이지 제외
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

