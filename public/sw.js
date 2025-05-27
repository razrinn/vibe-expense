// Define the version of the cache.
// Change this version to trigger an update of the service worker and a refresh of the cache.
const APP_VERSION = 'v1.0.14';

// List of URLs to cache during the service worker installation.
// These are typically the core assets needed for the app shell to work offline.
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/icon-191-maskable.png',
  '/icon-192.png',
  '/icon-512-maskable.png',
  '/icon-512.png',
  // Add other critical assets like main CSS/JS files if they are not versioned by filename
];

// Install service worker:
// This event is triggered when a new service worker is being installed.
self.addEventListener('install', (event) => {
  console.log(`[Service Worker] Installing version: ${APP_VERSION}`);
  event.waitUntil(
    caches
      .open(APP_VERSION)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        // cache.addAll() fetches requests from the network and caches the responses.
        // If any request fails, the whole operation fails, and the SW won't install.
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error(
          '[Service Worker] Failed to cache app shell during install:',
          error
        );
        // If caching fails, the installation will fail, preventing a broken SW state.
      })
  );
  // self.skipWaiting() forces the waiting service worker to become the active service worker.
  // This means the new SW will activate as soon as it has finished installing,
  // without waiting for existing clients (tabs) to be closed.
  self.skipWaiting();
});

// Activate service worker:
// This event is triggered when the service worker is activated.
// Activation happens after installation. It's a good place to clean up old caches.
self.addEventListener('activate', (event) => {
  console.log(`[Service Worker] Activating version: ${APP_VERSION}`);
  // Define a whitelist of cache names to keep. Only the current APP_VERSION cache.
  const cacheWhitelist = [APP_VERSION];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // If a cacheName is not in our whitelist, delete it.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log(`[Service Worker] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // clients.claim() allows an active service worker to take control of all clients
  // (e.g., open tabs) that are in its scope. This ensures that clients
  // are controlled by this version of the service worker immediately after activation.
  self.clients.claim();

  // Send a message to all controlled clients that a new version is available.
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'NEW_VERSION_AVAILABLE',
        version: APP_VERSION,
      });
    });
  });
});

// Fetch event:
// This event is triggered for every network request made by pages controlled by this service worker.
self.addEventListener('fetch', (event) => {
  // We only want to handle GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // console.log(`[Service Worker] Returning from cache: ${event.request.url}`);
        return cachedResponse;
      }

      // console.log(`[Service Worker] Fetching from network: ${event.request.url}`);
      return fetch(event.request)
        .then((networkResponse) => {
          // We only cache responses with a 200 status and of type 'basic' (same-origin).
          // Opaque responses (type 'opaque') are for cross-origin requests made with 'no-cors'.
          // We don't cache them because we can't verify their status or content.
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== 'basic'
          ) {
            return networkResponse;
          }

          // Clone the response. A response is a stream and can only be consumed once.
          // We need one copy for the browser to consume and one for the cache.
          const responseToCache = networkResponse.clone();

          caches.open(APP_VERSION).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch((error) => {
          // Handle network errors (e.g., user is offline).
          console.warn(
            `[Service Worker] Network fetch failed for ${event.request.url}:`,
            error
          );
          // At this point, the request was not in cache and network failed.
          // You could return a custom offline fallback page or image here if desired.
          // For example, for navigation requests:
          // if (event.request.mode === 'navigate') {
          //   return caches.match('/offline.html'); // Ensure '/offline.html' is in urlsToCache
          // }
          // If no specific fallback, the browser will show its default network error page.
          // Re-throwing the error will ensure the fetch promise rejects as expected by the browser.
          throw error;
        });
    })
  );
});
