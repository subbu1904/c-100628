// CryptoView Service Worker
const CACHE_NAME = 'cryptoview-v2';

// Cache categories
const STATIC_CACHE = `${CACHE_NAME}-static`;
const DYNAMIC_CACHE = `${CACHE_NAME}-dynamic`;
const API_CACHE = `${CACHE_NAME}-api`;

// Assets to cache immediately on installation
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// API endpoints to cache with network-first strategy
const API_ROUTES = [
  'https://api.coincap.io/v2/assets',
  'https://api.coincap.io/v2/assets?limit=20'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker...');
  
  // Skip waiting for the previous service worker
  self.skipWaiting();
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE)
        .then((cache) => {
          console.log('[Service Worker] Caching core app shell assets...');
          return cache.addAll(STATIC_ASSETS);
        }),
      caches.open(API_CACHE)
        .then((cache) => {
          console.log('[Service Worker] Pre-caching API routes...');
          // We don't pre-cache API responses as they should be fresh
          // But we can pre-cache the routes for later network-first strategy
          return Promise.resolve();
        })
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Service Worker...');
  
  // Take control of all clients immediately
  event.waitUntil(clients.claim());
  
  // Remove old cache versions
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('cryptoview-') && 
                 !cacheName.endsWith('-v2'); // Only keep the latest version
        }).map(cacheName => {
          console.log('[Service Worker] Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Helper function to determine the type of resource
function getResourceType(url) {
  const parsedUrl = new URL(url);
  
  // API requests
  if (parsedUrl.hostname.includes('api.coincap.io') || parsedUrl.pathname.includes('/api/')) {
    return 'api';
  }
  
  // Static assets
  const fileExtension = url.split('.').pop().toLowerCase();
  if (['js', 'css', 'png', 'jpg', 'jpeg', 'svg', 'ico', 'woff', 'woff2', 'ttf'].includes(fileExtension)) {
    return 'static';
  }
  
  // HTML pages or other dynamic content
  return 'dynamic';
}

// Network-first strategy for API and dynamic content
async function networkFirstStrategy(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // If successful, clone and cache the response
    if (networkResponse.status === 200) {
      const responseToCache = networkResponse.clone();
      const cache = await caches.open(API_CACHE);
      cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network request failed, trying cache...', error);
    
    // Try cache if network fails
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If we're trying to load a page and there's no cached version, return the offline page
    if (request.mode === 'navigate') {
      const cache = await caches.open(STATIC_CACHE);
      return cache.match('/offline.html');
    }
    
    // Otherwise, let the error propagate
    throw error;
  }
}

// Cache-first strategy for static assets
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // If not in cache, get from network
    const networkResponse = await fetch(request);
    
    // Only cache successful responses
    if (networkResponse.status === 200) {
      const clone = networkResponse.clone();
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, clone);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Error fetching and caching:', error);
    throw error;
  }
}

// Stale-while-revalidate strategy for dynamic content
async function staleWhileRevalidateStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  // Fetch from network and update cache in the background
  const fetchPromise = fetch(request)
    .then(async (networkResponse) => {
      if (networkResponse.status === 200) {
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(error => {
      console.error('[Service Worker] Fetch failed:', error);
      // If we're trying to load a page and fetch fails, return the offline page
      if (request.mode === 'navigate') {
        return caches.match('/offline.html');
      }
      throw error;
    });
  
  // Return the cached response immediately if available, or wait for the network
  return cachedResponse || fetchPromise;
}

// Fetch event - handle all requests
self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // Skip cross-origin requests like chrome-extension://
  if (!request.url.startsWith('http')) {
    return;
  }
  
  const resourceType = getResourceType(request.url);
  
  if (resourceType === 'api') {
    // Network-first for API requests
    event.respondWith(networkFirstStrategy(request));
  } else if (resourceType === 'static') {
    // Cache-first for static assets
    event.respondWith(cacheFirstStrategy(request));
  } else {
    // Stale-while-revalidate for dynamic content
    event.respondWith(staleWhileRevalidateStrategy(request));
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background Sync event triggered:', event.tag);
  
  if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  }
});

// Push notification support
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received:', event);
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'CryptoView Update';
  const options = {
    body: data.body || 'New information is available',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/notification-badge.png',
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click:', event);
  
  event.notification.close();
  
  // Open the target URL (or default to root) when notification is clicked
  const urlToOpen = new URL(event.notification.data.url || '/', self.location.origin).href;
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Helper function to sync favorites data when back online
async function syncFavorites() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const pendingFavorites = await cache.match('pendingFavorites');
    
    if (pendingFavorites) {
      const favoritesData = await pendingFavorites.json();
      
      // Process each pending favorite operation
      for (const op of favoritesData.operations) {
        try {
          // Here would be the actual API call to update favorites on the server
          console.log('[Service Worker] Syncing favorite operation:', op);
          
          // Simulate API call
          await fetch(`/api/favorites/${op.action}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              assetId: op.assetId,
              userId: op.userId
            })
          });
          
          console.log('[Service Worker] Favorite operation synced successfully');
        } catch (error) {
          console.error('[Service Worker] Failed to sync favorite operation:', error);
          // Keep the operation in the pending list for next sync attempt
          throw error;
        }
      }
      
      // Clear the pending operations after successful sync
      await cache.delete('pendingFavorites');
    }
  } catch (error) {
    console.error('[Service Worker] Failed to sync favorites:', error);
    throw error;
  }
}
