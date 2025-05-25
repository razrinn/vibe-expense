const APP_VERSION = 'v1.0.3';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192-maskable.png',
  '/icon-192.png',
  '/icon-512-maskable.png',
  '/icon-512.png',
];

// Install service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_VERSION).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Force the new service worker to activate immediately
});

// Activate service worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [APP_VERSION];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  clients.claim(); // Take control of existing clients immediately
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request).then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(APP_VERSION).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
