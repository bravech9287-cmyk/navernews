/**
 * Service Worker
 * 
 * PWA 오프라인 지원을 위한 기본 Service Worker입니다.
 * 캐싱 전략을 통해 오프라인에서도 기본 기능을 사용할 수 있도록 합니다.
 */

const CACHE_NAME = "my-trip-v1";
const urlsToCache = [
  "/",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// 설치 이벤트: 초기 캐싱
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 활성화 이벤트: 오래된 캐시 정리
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// fetch 이벤트: 네트워크 우선, 실패 시 캐시 사용
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 네트워크 응답이 성공하면 캐시에 저장하고 반환
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        // 네트워크 실패 시 캐시에서 찾아서 반환
        return caches.match(event.request);
      })
  );
});

