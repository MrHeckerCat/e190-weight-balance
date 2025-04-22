const CACHE_NAME = 'e190-wb-v1';
const assets = [
    '/e190-weight-balance/',
    '/e190-weight-balance/index.html',
    '/e190-weight-balance/manifest.json',
    '/e190-weight-balance/sw.js',
    '/e190-weight-balance/Rajdhani-Regular.ttf',
    '/e190-weight-balance/icons/icon-72x72.png',
    '/e190-weight-balance/icons/icon-96x96.png',
    '/e190-weight-balance/icons/icon-128x128.png',
    '/e190-weight-balance/icons/icon-144x144.png',
    '/e190-weight-balance/icons/icon-152x152.png',
    '/e190-weight-balance/icons/icon-192x192.png',
    '/e190-weight-balance/icons/icon-384x384.png',
    '/e190-weight-balance/icons/icon-512x512.png'
];

// Install event
self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(assets);
        })
    );
});

// Activate event
self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            );
        })
    );
});

// Fetch event with improved error handling
self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match(evt.request)
            .then(cacheRes => {
                return cacheRes || fetch(evt.request)
                    .then(fetchRes => {
                        return caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(evt.request.url, fetchRes.clone());
                                return fetchRes;
                            });
                    });
            })
            .catch(() => {
                // Fallback for offline functionality
                if (evt.request.url.indexOf('.html') > -1) {
                    return caches.match('/e190-weight-balance/index.html');
                }
            })
    );
});
