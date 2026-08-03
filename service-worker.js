// service-worker.js

const CACHE_NAME = 'jkradio-cache-v1';

// List of all the assets referenced in index.html to pre-cache
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/tvtvnews.html',
    '/jukebox.html',
    '/myradio.html',
    '/musicplayer.html',
    '/player.html',
    '/jkradio.html',
    '/css/button.css',
    '/js/hls.js@latest',
    '/js/video-js.css',
    '/js/video.js',
    '/js/jquery.min.js',
    '/js/pwa.js',
    '/image/jatinder.jpg',
    '/image/exit.png',
    '/icon.png',
    '/image/192.png',
    '/image/512.png'
];

// 1. Install Event: Pre-cache the assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// 2. Activate Event: Clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. Fetch Event: Cache-First strategy with Network Fallback
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return the cached response if found
                if (response) {
                    return response;
                }
                
                // Otherwise, fetch from the network
                return fetch(event.request).then(networkResponse => {
                    // Check if we received a valid response
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }

                    // Clone the response because it's a stream and can only be consumed once
                    const responseToCache = networkResponse.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            // Dynamically cache new requests (optional, but good for media apps)
                            // Only cache http/https requests, avoid chrome-extension:// etc.
                            if (event.request.url.startsWith('http')) {
                                cache.put(event.request, responseToCache);
                            }
                        });

                    return networkResponse;
                }).catch(() => {
                    // Fallback for when the network fails (e.g., offline)
                    // You could return a specific offline.html page here if you create one
                    console.log('Network request failed and no cache available for:', event.request.url);
                });
            })
    );
});