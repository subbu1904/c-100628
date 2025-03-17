
// Service Worker with cache-first strategy for assets and network-first for API calls

const CACHE_NAME = 'cryptoview-v1';
const ASSETS_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  // Parse the URL
  const requestUrl = new URL(event.request.url);
  
  // For API calls, use network first strategy
  if (requestUrl.pathname.includes('/api/') || requestUrl.hostname.includes('api.coincap.io')) {
    event.respondWith(
      fetchWithNetworkFirst(event.request)
    );
  } 
  // For static assets, use cache first strategy
  else {
    event.respondWith(
      fetchWithCacheFirst(event.request)
    );
  }
});

// Network first strategy for API calls
async function fetchWithNetworkFirst(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Clone the response before returning it
    const responseToCache = networkResponse.clone();
    
    // Cache the successful response
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Only cache valid responses
        if (responseToCache.status === 200) {
          cache.put(request, responseToCache);
        }
      });
    
    return networkResponse;
  } catch (error) {
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If there's no cached data, rethrow the error
    throw error;
  }
}

// Cache first strategy for static assets
async function fetchWithCacheFirst(request) {
  // Check cache first
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // If not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);
    
    // Cache the successful response for future
    const responseToCache = networkResponse.clone();
    
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Only cache valid responses
        if (responseToCache.status === 200) {
          cache.put(request, responseToCache);
        }
      });
    
    return networkResponse;
  } catch (error) {
    // Handle fetch errors (e.g., offline)
    console.error('Fetch error:', error);
    
    // For HTML requests, return a simple offline page if possible
    if (request.headers.get('Accept').includes('text/html')) {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}
