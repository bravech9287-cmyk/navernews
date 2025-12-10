/**
 * @file naver.d.ts
 * @description 네이버 지도 API 타입 정의
 *
 * 네이버 지도 JavaScript API v3의 타입 정의입니다.
 */

declare namespace naver.maps {
  class Map {
    constructor(element: HTMLElement, options: MapOptions);
    setCenter(latlng: LatLng): void;
    setZoom(zoom: number): void;
    fitBounds(bounds: LatLngBounds, options?: { padding?: number }): void;
  }

  interface MapOptions {
    center: LatLng;
    zoom: number;
    mapTypeControl?: boolean;
    mapTypeControlOptions?: MapTypeControlOptions;
    zoomControl?: boolean;
    zoomControlOptions?: ZoomControlOptions;
  }

  interface MapTypeControlOptions {
    style: MapTypeControlStyle;
    position: Position;
  }

  interface ZoomControlOptions {
    position: Position;
  }

  enum MapTypeControlStyle {
    BUTTON = 1,
  }

  enum Position {
    TOP_LEFT = 1,
    TOP_RIGHT = 2,
    BOTTOM_LEFT = 3,
    BOTTOM_RIGHT = 4,
  }

  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  class LatLngBounds {
    extend(latlng: LatLng): void;
  }

  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
    setIcon(icon: IconOptions): void;
  }

  interface MarkerOptions {
    position: LatLng;
    map: Map;
    title?: string;
    icon?: IconOptions;
  }

  interface IconOptions {
    content: string;
    anchor: Point;
  }

  class Point {
    constructor(x: number, y: number);
  }

  class InfoWindow {
    constructor(options: InfoWindowOptions);
    open(map: Map, anchor: Marker | LatLng): void;
    close(): void;
  }

  interface InfoWindowOptions {
    content: string;
  }

  namespace Event {
    function addListener(
      target: Marker,
      event: string,
      handler: () => void
    ): void;
  }
}

declare interface Window {
  naver: {
    maps: typeof naver.maps;
  };
}

