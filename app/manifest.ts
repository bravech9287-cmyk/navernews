import { MetadataRoute } from "next";

/**
 * PWA Manifest 파일
 * 
 * Progressive Web App으로 설치할 수 있도록 설정합니다.
 * 아이콘, 색상, 이름 등을 정의합니다.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "My Trip - 한국 관광지 정보 서비스",
    short_name: "My Trip",
    description: "전국의 관광지 정보를 쉽게 검색하고, 지도에서 확인하며, 상세 정보를 조회할 수 있는 웹 서비스",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a0a0a",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icons/icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    categories: ["travel", "navigation", "lifestyle"],
    lang: "ko",
    dir: "ltr",
    scope: "/",
  };
}

