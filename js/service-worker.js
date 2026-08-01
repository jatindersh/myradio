const cacheVersion = "v1"; // Versioned cache name

// Function to add resources to cache with error handling
const addResourcesToCache = async (resources) => {
    try {
        const cache = await caches.open(cacheVersion);
        for (const resource of resources) {
            try {
                const response = await fetch(resource);
                if (!response.ok) {
                    console.error(`Failed to fetch resource: ${resource}, Status: ${response.status}`);
                    continue; // Skip adding the resource
                }
                await cache.put(resource, response);
                console.log(`Successfully cached: ${resource}`);
            } catch (error) {
                console.error(`Failed to cache resource: ${resource}`, error);
            }
        }
    } catch (error) {
        console.error("Failed to cache resources:", error);
    }
};

// Enable navigation preload
const enableNavigationPreload = async () => {
    if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
        console.log("Navigation preload enabled.");
    }
};

// Delete old caches
const deleteOldCaches = async () => {
    const cacheKeepList = [cacheVersion];
    const keyList = await caches.keys();
    const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
    console.log("Deleting caches:", cachesToDelete);
    await Promise.all(cachesToDelete.map((key) => caches.delete(key)));
};

// Install event
self.addEventListener("install", (event) => {
    // 1. THIS IS NEW: Forces the waiting service worker to become active immediately
    self.skipWaiting(); 
    
    event.waitUntil(
        addResourcesToCache([
            "/", 
            "/index.html",
            "/aajtakaudio.html",
            "/dadaji.html",
            "/r1.html",
            "/offline.html",
            "/aajtak.html",
            "/mirchi.html",
            "/dharam.html",
            "/rainbow.html",
            "/jammu.html",
            "/weather.html",
            "/myradio.html",
            "/songs.html",
            "/container.html",
             "/background.html",
             "/food.html",
             "/food1.html",
            "/food2.html",
            "/food3.html",
            "/food4.html",
            "/food5.html",
            "/wapi.html",
            "/reader.html",
            "/gita.html",
            "/humanbody.html",
            "/ikigai.html",
            "/wdetail.html",
            "/weatherLL.html",
            "/jukebox.html",
            "/css/button.css",
            "/css/style.css",
            "/js/video.js",
            "/js/video-js.css",
            "/js/jquery.min.js",
            "/js/jquery.marquee.min.js",
            "/js/hls.js@latest",
            "/js/refresh.js",
            "/js/jq1.js",
            "/js/jq2.js",
            "/image/jkpic1.png", 
            "/image/refresh.jpg", 
            "/image/mine.ico",
            "/image/radio.png",
            "/image/jkpic2.png",
            "/image/picone.png",
            "/image/vol.png",
            "/image/tune.png",
            "/image/pictwo.png",
            "/Books/indian-food-recipes.pdf",
            "/Books/Book1.pdf",
            "/Books/Book2.pdf",
            "/Books/Book3.pdf",
            "/Books/Book4.pdf",
            "/Books/By_God_Oh_My_God.pdf",
            "/Books/Bhagavad.pdf",
            "/Books/humanbody.pdf",
            "/Books/Ikigai.pdf"
        ])
    );
    console.log("Service worker installed, resources caching initiated.");
});

// Activate event
self.addEventListener("activate", (event) => {
    event.waitUntil(
        Promise.all([
            enableNavigationPreload(), 
            deleteOldCaches(),
            // 2. THIS IS NEW: Tells the new service worker to take control of the page immediately
            self.clients.claim() 
        ])
    );
    console.log("Service worker activated, old caches deleted, and clients claimed.");
});

// Fetch event with navigation preload handling
self.addEventListener("fetch", (event) => {
    const request = event.request;

    if (request.mode === "navigate") {
        event.respondWith(
            (async () => {
                try {
                    // Use navigation preload response if available
                    const preloadResponse = await event.preloadResponse;
                    if (preloadResponse) {
                        console.log("Using preload response:", request.url);
                        return preloadResponse;
                    }

                    // Check the cache for a response
                    const cachedResponse = await caches.match(request);
                    if (cachedResponse) {
                        console.log("Serving from cache:", request.url);
                        return cachedResponse;
                    }

                    // Fetch from network if no preload or cache response
                    console.log("Fetching from network:", request.url);
                    return await fetch(request);
                } catch (error) {
                    console.error("Fetch failed, serving offline.html:", error);
                    return caches.match("/offline.html");
                }
            })()
        );
    } else {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                return cachedResponse || fetch(request).catch((error) => {
                    console.error(`Fetch failed for ${request.url}:`, error);
                });
            })
        );
    }
});