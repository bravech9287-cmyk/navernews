/**
 * @file naver-map.tsx
 * @description 네이버 지도 컴포넌트
 *
 * 관광지 목록을 네이버 지도에 마커로 표시하는 컴포넌트입니다.
 * Naver Maps JavaScript API v3 (NCP)를 사용합니다.
 *
 * @see {@link /docs/PRD.md} - 네이버 지도 연동 요구사항 (2.2장)
 */

"use client";

import { useEffect, useRef, useState } from "react";
import type { TourItem } from "@/lib/types/tour";
import { convertTourCoordinates } from "@/lib/utils/coordinate";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    naver: typeof naver;
  }
}

interface NaverMapProps {
  tours: TourItem[];
  selectedTourId?: string;
  onTourSelect?: (tour: TourItem) => void;
  className?: string;
  initialCenter?: [number, number]; // [경도, 위도]
  initialZoom?: number;
}

export function NaverMap({
  tours,
  selectedTourId,
  onTourSelect,
  className,
  initialCenter,
  initialZoom = 10,
}: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const infoWindowsRef = useRef<naver.maps.InfoWindow[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 네이버 지도 API 스크립트 로드
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
    if (!clientId) {
      setError("네이버 지도 API 키가 설정되지 않았습니다.");
      return;
    }

    // 이미 로드되어 있으면 바로 사용
    if (typeof window !== "undefined" && window.naver?.maps) {
      setIsLoaded(true);
      return;
    }

    // 스크립트가 이미 추가되어 있는지 확인
    const existingScript = document.querySelector(
      `script[src*="oapi.map.naver.com"]`
    );
    if (existingScript) {
      // 스크립트가 있으면 로드 대기
      const checkNaver = setInterval(() => {
        if (typeof window !== "undefined" && window.naver?.maps) {
          setIsLoaded(true);
          clearInterval(checkNaver);
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkNaver);
        if (!isLoaded) {
          setError("네이버 지도 API를 불러올 수 없습니다.");
        }
      }, 10000);
      return;
    }

    // 스크립트 동적 로드
    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
    script.async = true;
    script.onload = () => {
      if (typeof window !== "undefined" && window.naver?.maps) {
        setIsLoaded(true);
      } else {
        setError("네이버 지도 API를 불러올 수 없습니다.");
      }
    };
    script.onerror = () => {
      setError("네이버 지도 API 스크립트를 불러오는 중 오류가 발생했습니다.");
    };
    document.head.appendChild(script);

    return () => {
      // cleanup은 하지 않음 (스크립트는 재사용)
    };
  }, [isLoaded]);

  // 지도 초기화
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
    if (!clientId) {
      setError("네이버 지도 API 키가 설정되지 않았습니다.");
      return;
    }

    try {
      // 초기 중심 좌표 설정
      const center = initialCenter || [127.5, 37.5]; // 서울 기본 좌표

      // 지도 생성
      const map = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(center[1], center[0]),
        zoom: initialZoom,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: window.naver.maps.MapTypeControlStyle.BUTTON,
          position: window.naver.maps.Position.TOP_RIGHT,
        },
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_LEFT,
        },
      });

      mapInstanceRef.current = map;
    } catch (err) {
      console.error("Failed to initialize map:", err);
      setError("지도를 초기화할 수 없습니다.");
    }
  }, [isLoaded, initialCenter, initialZoom]);

  // 마커 표시
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    const map = mapInstanceRef.current;

    // 기존 마커 및 인포윈도우 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    infoWindowsRef.current.forEach((infoWindow) => infoWindow.close());
    markersRef.current = [];
    infoWindowsRef.current = [];

    // 관광지가 없으면 종료
    if (tours.length === 0) return;

    // 모든 관광지의 좌표를 변환하여 마커 생성
    const bounds = new window.naver.maps.LatLngBounds();

    tours.forEach((tour) => {
      try {
        const [lng, lat] = convertTourCoordinates(tour.mapx, tour.mapy);

        // 좌표가 유효한지 확인
        if (lat === 0 && lng === 0) return;

        const position = new window.naver.maps.LatLng(lat, lng);
        bounds.extend(position);

        // 마커 생성
        const marker = new window.naver.maps.Marker({
          position,
          map,
          title: tour.title,
          icon: {
            content: `
              <div style="
                background-color: #4285f4;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              "></div>
            `,
            anchor: new window.naver.maps.Point(12, 12),
          },
        });

        // 인포윈도우 생성
        const infoWindow = new window.naver.maps.InfoWindow({
          content: `
            <div style="
              padding: 12px;
              min-width: 200px;
              max-width: 300px;
            ">
              <h3 style="
                font-size: 14px;
                font-weight: bold;
                margin: 0 0 8px 0;
                color: #333;
              ">${tour.title}</h3>
              <p style="
                font-size: 12px;
                color: #666;
                margin: 0 0 8px 0;
              ">${tour.addr1 || "주소 정보 없음"}</p>
              <a href="/places/${tour.contentid}" style="
                display: inline-block;
                padding: 6px 12px;
                background-color: #4285f4;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                font-size: 12px;
              ">상세보기</a>
            </div>
          `,
        });

        // 마커 클릭 이벤트
        window.naver.maps.Event.addListener(marker, "click", () => {
          // 다른 인포윈도우 닫기
          infoWindowsRef.current.forEach((iw) => iw.close());
          // 현재 인포윈도우 열기
          infoWindow.open(map, marker);
          // 리스트 연동
          if (onTourSelect) {
            onTourSelect(tour);
          }
        });

        markersRef.current.push(marker);
        infoWindowsRef.current.push(infoWindow);

        // 선택된 관광지 마커 강조
        if (selectedTourId === tour.contentid) {
          marker.setIcon({
            content: `
              <div style="
                background-color: #ea4335;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 4px 8px rgba(0,0,0,0.4);
              "></div>
            `,
            anchor: new window.naver.maps.Point(16, 16),
          });
          // 선택된 관광지로 지도 이동
          map.setCenter(position);
          map.setZoom(15);
          infoWindow.open(map, marker);
        }
      } catch (err) {
        console.error(`Failed to create marker for ${tour.title}:`, err);
      }
    });

    // 모든 마커가 보이도록 지도 범위 조정
    if (tours.length > 0) {
      map.fitBounds(bounds, { padding: 50 });
    }
  }, [tours, selectedTourId, isLoaded, onTourSelect]);

  if (error) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center bg-muted rounded-lg border border-border",
          className
        )}
        style={{ minHeight: "400px" }}
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mb-3">
          <svg
            className="w-6 h-6 text-destructive"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-foreground mb-1">지도 로드 실패</p>
        <p className="text-xs text-muted-foreground text-center px-4">
          {error}
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center bg-muted rounded-lg border border-border",
          className
        )}
        style={{ minHeight: "400px" }}
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
          <svg
            className="w-6 h-6 text-primary animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-foreground">지도를 불러오는 중...</p>
        <p className="text-xs text-muted-foreground mt-1">
          잠시만 기다려주세요
        </p>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className={cn("w-full rounded-lg overflow-hidden", className)}
      style={{ minHeight: "400px" }}
    />
  );
}

