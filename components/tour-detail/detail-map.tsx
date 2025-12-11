/**
 * @file detail-map.tsx
 * @description 관광지 지도 섹션 컴포넌트
 *
 * 관광지 상세페이지의 지도를 표시하는 컴포넌트입니다.
 * 단일 관광지 위치를 마커로 표시하고 길찾기 기능을 제공합니다.
 *
 * 주요 기능:
 * 1. 해당 관광지 위치 표시
 * 2. 마커 1개 표시
 * 3. "길찾기" 버튼 (네이버 지도 앱/웹 연동)
 * 4. 좌표 정보 표시 (선택 사항)
 *
 * @dependencies
 * - Naver Maps JavaScript API v3 (NCP)
 * - @/lib/utils/coordinate: 좌표 변환 유틸리티
 * - lucide-react: 아이콘
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { convertTourCoordinates } from "@/lib/utils/coordinate";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Loading } from "@/components/ui/loading";
import { Error as ErrorDisplay } from "@/components/ui/error";

declare global {
  interface Window {
    naver: typeof naver;
  }
}

interface DetailMapProps {
  mapx: string; // 경도 (KATEC)
  mapy: string; // 위도 (KATEC)
  title?: string;
  address?: string;
  className?: string;
}

/**
 * 관광지 지도 섹션 컴포넌트
 */
export function DetailMap({
  mapx,
  mapy,
  title,
  address,
  className,
}: DetailMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const markerRef = useRef<naver.maps.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 좌표 변환
  const [lng, lat] = convertTourCoordinates(mapx, mapy);

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
      // cleanup은 하지 않음 (다른 컴포넌트에서도 사용 가능)
    };
  }, [isLoaded]);

  // 지도 초기화
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.naver?.maps) {
      return;
    }

    try {
      const naver = window.naver;
      const position = new naver.maps.LatLng(lat, lng);

      // 지도 생성
      const map = new naver.maps.Map(mapRef.current, {
        center: position,
        zoom: 16,
        zoomControl: true,
        zoomControlOptions: {
          position: naver.maps.Position.TOP_RIGHT,
        },
      });

      mapInstanceRef.current = map;

      // 마커 생성
      const marker = new naver.maps.Marker({
        position: position,
        map: map,
        icon: {
          content: [
            '<div style="',
            'background-color: #ef4444;',
            'width: 32px;',
            'height: 32px;',
            'border-radius: 50%;',
            'border: 3px solid white;',
            'box-shadow: 0 2px 4px rgba(0,0,0,0.3);',
            'display: flex;',
            'align-items: center;',
            'justify-content: center;',
            '">',
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">',
            '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>',
            '</svg>',
            '</div>',
          ].join(""),
          anchor: new naver.maps.Point(16, 16),
        },
      });

      markerRef.current = marker;

      // 인포윈도우 표시 (선택 사항)
      if (title) {
        let infoWindow: naver.maps.InfoWindow | null = null;
        
        naver.maps.Event.addListener(marker, "click", () => {
          if (infoWindow) {
            infoWindow.close();
            infoWindow = null;
          } else {
            infoWindow = new naver.maps.InfoWindow({
              content: `
                <div style="padding: 8px; min-width: 150px;">
                  <div style="font-weight: bold; margin-bottom: 4px;">${title}</div>
                  ${address ? `<div style="font-size: 12px; color: #666;">${address}</div>` : ""}
                </div>
              `,
            });
            infoWindow.open(map, marker);
          }
        });
      }
    } catch (err) {
      console.error("지도 초기화 실패:", err);
      setError("지도를 표시할 수 없습니다.");
    }

    return () => {
      // cleanup
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [isLoaded, lat, lng, title, address]);

  // 길찾기 URL 생성 (네이버 지도 앱/웹)
  const getDirectionsUrl = () => {
    // 네이버 지도 길찾기 URL: https://map.naver.com/v5/directions/{좌표}
    return `https://map.naver.com/v5/directions/${lng},${lat}`;
  };

  if (error) {
    return (
      <section className={cn("space-y-4", className)} aria-label="위치 정보">
        <h2 className="text-2xl font-bold">위치 정보</h2>
        <ErrorDisplay message={error} />
      </section>
    );
  }

  if (!isLoaded) {
    return (
      <section className={cn("space-y-4", className)} aria-label="위치 정보">
        <h2 className="text-2xl font-bold">위치 정보</h2>
        <div className="relative w-full h-[400px] md:h-[500px] rounded-xl border bg-muted flex items-center justify-center">
          <Loading size="lg" text="지도를 불러오는 중..." />
        </div>
      </section>
    );
  }

  return (
    <section className={cn("space-y-4", className)} aria-label="위치 정보">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">위치 정보</h2>
        <Button
          onClick={() => window.open(getDirectionsUrl(), "_blank")}
          className="gap-2"
          aria-label="네이버 지도에서 길찾기"
        >
          <Navigation className="h-4 w-4" />
          <span>길찾기</span>
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>

      {/* 지도 컨테이너 */}
      <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden border bg-muted">
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {/* 주소 및 좌표 정보 */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-4 rounded-lg border bg-card">
        <div className="flex items-start gap-2 flex-1">
          <MapPin className="h-5 w-5 mt-0.5 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            {address && (
              <p className="text-sm font-medium mb-1">주소</p>
            )}
            {address && (
              <p className="text-sm text-muted-foreground break-words">
                {address}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2 font-mono">
              좌표: {lat.toFixed(6)}, {lng.toFixed(6)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

