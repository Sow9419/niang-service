// service-worker.js

const CACHE_NAME = 'niang-service-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install event: pre-cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching app shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: handle caching strategies
self.addEventListener('fetch', (event) => {
  const supabaseUrl = 'https://dixobsklkrjxslntalss.supabase.co';

  // Strategy 1: Network only for API calls
  // If the request is for our Supabase API, always fetch from the network.
  if (event.request.url.startsWith(supabaseUrl)) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Strategy 2: Cache first, falling back to network for static assets
  // For all other requests (app shell, static assets), try the cache first.
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        // If we got a valid response, cache it for future use.
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });
    })
  );
});