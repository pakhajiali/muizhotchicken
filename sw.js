/* ============================================================
   SERVICE WORKER - Muiz Hot Chicken PWA
   Restoran Pak Haji Ali & Muiz Hot Chicken - Subang Jaya (USJ 8)
   ============================================================ */

const CACHE_VERSION = 'v3';
const CACHE_NAME = `muiz-hot-chicken-${CACHE_VERSION}`;

// ===== ASSETS TO CACHE (root paths for custom domain) =====
const STATIC_ASSETS = [
    // Root files
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    
    // Icons
    '/favicon.ico',
    '/favicon.svg',
    '/favicon-96x96.png',
    '/apple-touch-icon.png',
    '/web-app-manifest-192x192.png',
    '/web-app-manifest-512x512.png',
    '/logo.webp',
    
    // iOS interface
    '/ios/index.html',
    '/ios/style.css',
    '/ios/script.js',
    
    // Android interface
    '/android/index.html',
    '/android/style.css',
    '/android/script.js',
    
    // Web interface
    '/web/index.html',
    '/web/style.css',
    '/web/script.js',
    
    // Shared data
    '/shared/data.js',
];

// ===== DYNAMIC CACHE RULES =====
const DYNAMIC_CACHE = [
    '/images/',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/',
    'https://fonts.googleapis.com/',
    'https://fonts.gstatic.com/'
];

// ===== INSTALL EVENT =====
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log(`📦 Installing ${CACHE_NAME}`);
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('✅ Service Worker installed successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Failed to cache assets:', error);
            })
    );
});

// ===== ACTIVATE EVENT =====
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME && cacheName.startsWith('muiz-hot-chicken-')) {
                            console.log(`🗑️ Removing old cache: ${cacheName}`);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log(`✅ Service Worker activated: ${CACHE_NAME}`);
                return self.clients.claim();
            })
    );
});

// ===== FETCH EVENT =====
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip cross-origin requests (except CDN)
    if (url.origin !== self.location.origin) {
        if (url.hostname.includes('cdnjs.cloudflare.com') ||
            url.hostname.includes('fonts.googleapis.com') ||
            url.hostname.includes('fonts.gstatic.com')) {
            // Network-first for CDN
            event.respondWith(
                fetch(request)
                    .catch(() => caches.match(request))
            );
            return;
        }
        return;
    }
    
    if (request.method !== 'GET') return;
    
    const isImage = /\.(webp|png|jpg|jpeg|gif|svg|ico)$/.test(request.url);
    const isHTML = /\.html$/.test(request.url) || request.url.endsWith('/') || request.url.includes('index.html');
    
    if (isHTML) {
        // Network-first for HTML
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
                    return response;
                })
                .catch(() => {
                    return caches.match(request)
                        .then((cached) => cached || caches.match('/index.html'));
                })
        );
        return;
    }
    
    if (isImage) {
        // Cache-first for images
        event.respondWith(
            caches.match(request)
                .then((cached) => {
                    if (cached) return cached;
                    return fetch(request)
                        .then((response) => {
                            const clone = response.clone();
                            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                            return response;
                        })
                        .catch(() => caches.match('/logo.webp'));
                })
        );
        return;
    }
    
    // Default: Cache-first
    event.respondWith(
        caches.match(request)
            .then((cached) => {
                if (cached) {
                    // Background update
                    fetch(request).then((response) => {
                        if (response && response.status === 200) {
                            caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
                        }
                    }).catch(() => {});
                    return cached;
                }
                return fetch(request)
                    .then((response) => {
                        if (response && response.status === 200) {
                            const clone = response.clone();
                            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                        }
                        return response;
                    })
                    .catch(() => {
                        if (request.headers.get('accept').includes('text/html')) {
                            return caches.match('/index.html');
                        }
                        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
                    });
            })
    );
});

// ===== PUSH NOTIFICATIONS =====
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || '🍗 Muiz Hot Chicken';
    const options = {
        body: data.body || 'Check out our latest offers!',
        icon: '/logo.webp',
        badge: '/favicon-96x96.png',
        vibrate: [200, 100, 200],
        data: data.url || '/',
        actions: [
            { action: 'view', title: 'View Menu', icon: '/favicon-96x96.png' },
            { action: 'order', title: 'Order Now', icon: '/favicon-96x96.png' }
        ]
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

// ===== NOTIFICATION CLICK =====
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = event.notification.data || '/';
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                for (const client of clientList) {
                    if (client.url === url && 'focus' in client) return client.focus();
                }
                if (clients.openWindow) return clients.openWindow(url);
            })
    );
});

// ===== BACKGROUND SYNC =====
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-orders') {
        event.waitUntil(syncOrders());
    }
});

async function syncOrders() {
    // Placeholder – implement your logic
    console.log('🔄 Syncing orders...');
    return Promise.resolve();
}

// ===== MESSAGE HANDLING =====
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log(`📦 Service Worker ${CACHE_NAME} initialized`);
console.log(`✅ ${STATIC_ASSETS.length} static assets registered`);
