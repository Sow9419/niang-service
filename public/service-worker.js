// service-worker.js

const STATIC_CACHE_NAME = 'niang-service-static-v2';
const DYNAMIC_CACHE_NAME = 'niang-service-dynamic-v2';
const IMAGE_CACHE_NAME = 'niang-service-images-v2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install event: pre-cache the app shell and take control immediately
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing new version');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      // Force the waiting service worker to become the active service worker
      return self.skipWaiting();
    })
  );
});

// Activate event: clean up old caches and take control of all pages
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating new version');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE_NAME && 
              cacheName !== IMAGE_CACHE_NAME) {
            console.log('Service Worker: Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Helper function to determine if a request is for static assets
function isStaticAsset(url) {
  return url.pathname.match(/\.(js|css|html|woff2?|ttf|eot|ico|png|jpg|jpeg|gif|svg|webp)$/) ||
         url.pathname === '/' ||
         url.pathname.startsWith('/assets/') ||
         url.pathname === '/manifest.json';
}

// Helper function to determine if a request is for external images
function isExternalImage(url) {
  return url.hostname !== self.location.hostname && 
         url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp)$/);
}

// Cache First strategy for static assets
async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed for static asset', request.url);
    throw error;
  }
}

// Network First strategy for dynamic content (Supabase)
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache for:', request.url);
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale While Revalidate strategy for external images
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Always try to fetch in the background
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Ignore network errors for background fetch
  });
  
  // Return cached version immediately if available, otherwise wait for network
  if (cachedResponse) {
    return cachedResponse;
  }
  
  return fetchPromise;
}

// Main fetch event handler
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const supabaseUrl = 'https://dixobsklkrjxslntalss.supabase.co';
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Strategy 1: Network First for Supabase API calls
  if (event.request.url.startsWith(supabaseUrl)) {
    event.respondWith(networkFirstStrategy(event.request, DYNAMIC_CACHE_NAME));
    return;
  }
  
  // Strategy 2: Stale While Revalidate for external images
  if (isExternalImage(url)) {
    event.respondWith(staleWhileRevalidateStrategy(event.request, IMAGE_CACHE_NAME));
    return;
  }
  
  // Strategy 3: Cache First for static assets
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirstStrategy(event.request, STATIC_CACHE_NAME));
    return;
  }
  
  // Strategy 4: Network First for everything else (dynamic content)
  event.respondWith(networkFirstStrategy(event.request, DYNAMIC_CACHE_NAME));
});

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});