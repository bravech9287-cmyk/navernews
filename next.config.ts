import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "img.clerk.com" },
      { hostname: "www.visitkorea.or.kr" }, // 한국관광공사 이미지
      { hostname: "tong.visitkorea.or.kr" }, // 한국관광공사 이미지
      // 네이버 지도는 이미지가 아닌 JavaScript API이므로 이미지 도메인 추가 불필요
    ],
  },
};

export default nextConfig;
