/* ============================================================
   SERVICE WORKER - Muiz Hot Chicken PWA
   Restoran Pak Haji Ali & Muiz Hot Chicken - Subang Jaya (USJ 8)
   ============================================================ */

const CACHE_VERSION = 'v3';
const CACHE_NAME = `muiz-hot-chicken-${CACHE_VERSION}`;

// ===== ASSETS TO CACHE =====
const STATIC_ASSETS = [
    // Root files
    '/muizhotchicken/',
    '/muizhotchicken/index.html',
    '/muizhotchicken/style.css',
    '/muizhotchicken/script.js',
    '/muizhotchicken/manifest.json',
    
    // Icons
    '/muizhotchicken/favicon.ico',
    '/muizhotchicken/favicon.svg',
    '/muizhotchicken/favicon-96x96.png',
    '/muizhotchicken/apple-touch-icon.png',
    '/muizhotchicken/web-app-manifest-192x192.png',
    '/muizhotchicken/web-app-manifest-512x512.png',
    '/muizhotchicken/logo.webp',
    
    // iOS interface
    '/muizhotchicken/ios/index.html',
    '/muizhotchicken/ios/style.css',
    '/muizhotchicken/ios/script.js',
    
    // Android interface
    '/muizhotchicken/android/index.html',
    '/muizhotchicken/android/style.css',
    '/muizhotchicken/android/script.js',
    
    // Web interface
    '/muizhotchicken/web/index.html',
    '/muizhotchicken/web/style.css',
    '/muizhotchicken/web/script.js',
    
    // Shared data
    '/muizhotchicken/shared/data.js',
];

// ===== DYNAMIC CACHE RULES =====
const DYNAMIC_CACHE = [
    '/muizhotchicken/images/',
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
                        // Delete old caches
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
        // Allow CDN resources
        if (url.hostname.includes('cdnjs.cloudflare.com') ||
            url.hostname.includes('fonts.googleapis.com') ||
            url.hostname.includes('fonts.gstatic.com')) {
            // Use network-first for CDN
            event.respondWith(
                fetch(request)
                    .catch(() => {
                        return caches.match(request);
                    })
            );
            return;
        }
        // Skip other cross-origin requests
        return;
    }
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Check if request is for an image
    const isImage = /\.(webp|png|jpg|jpeg|gif|svg|ico)$/.test(request.url);
    const isHTML = /\.html$/.test(request.url) || request.url.endsWith('/') || request.url.includes('index.html');
    
    // Strategy: Cache-first for static assets, network-first for HTML
    if (isHTML) {
        // Network-first for HTML (always get fresh content)
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Cache the fresh response
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(request, responseClone);
                        });
                    return response;
                })
                .catch(() => {
                    // Fallback to cache
                    return caches.match(request)
                        .then((cachedResponse) => {
                            if (cachedResponse) {
                                return cachedResponse;
                            }
                            // Return offline fallback
                            return caches.match('/muizhotchicken/index.html');
                        });
                })
        );
        return;
    }
    
    if (isImage) {
        // Cache-first for images (with network fallback)
        event.respondWith(
            caches.match(request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    return fetch(request)
                        .then((response) => {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(request, responseClone);
                                });
                            return response;
                        })
                        .catch(() => {
                            // Return fallback image
                            return caches.match('/muizhotchicken/logo.webp');
                        });
                })
        );
        return;
    }
    
    // Default: Cache-first for static assets
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Return cached response, update in background
                    fetch(request)
                        .then((response) => {
                            if (response && response.status === 200) {
                                const responseClone = response.clone();
                                caches.open(CACHE_NAME)
                                    .then((cache) => {
                                        cache.put(request, responseClone);
                                    });
                            }
                        })
                        .catch(() => {});
                    return cachedResponse;
                }
                
                // Not in cache, fetch from network
                return fetch(request)
                    .then((response) => {
                        if (response && response.status === 200) {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(request, responseClone);
                                });
                        }
                        return response;
                    })
                    .catch(() => {
                        // Return offline fallback for HTML pages
                        if (request.headers.get('accept').includes('text/html')) {
                            return caches.match('/muizhotchicken/index.html');
                        }
                        // Return empty response for other requests
                        return new Response('Offline', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
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
        icon: '/muizhotchicken/logo.webp',
        badge: '/muizhotchicken/favicon-96x96.png',
        vibrate: [200, 100, 200],
        data: data.url || '/muizhotchicken/',
        actions: [
            {
                action: 'view',
                title: 'View Menu',
                icon: '/muizhotchicken/favicon-96x96.png'
            },
            {
                action: 'order',
                title: 'Order Now',
                icon: '/muizhotchicken/favicon-96x96.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// ===== NOTIFICATION CLICK =====
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    const url = event.notification.data || '/muizhotchicken/';
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Check if there's already a window/tab open
                for (const client of clientList) {
                    if (client.url === url && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Open a new window/tab
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
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
    try {
        // Get pending orders from IndexedDB or localStorage
        const pendingOrders = await getPendingOrders();
        
        if (pendingOrders.length === 0) {
            return;
        }
        
        // Process each pending order
        for (const order of pendingOrders) {
            // Send order to server/API
            await sendOrderToServer(order);
            // Remove from pending
            await removePendingOrder(order.id);
        }
        
        console.log('✅ Orders synced successfully');
    } catch (error) {
        console.error('❌ Failed to sync orders:', error);
        throw error; // Will retry on next sync
    }
}

// ===== MESSAGE HANDLING =====
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// ===== UTILITY FUNCTIONS =====
// (Placeholder for actual implementation)
async function getPendingOrders() {
    // Implement your logic to get pending orders
    return [];
}

async function sendOrderToServer(order) {
    // Implement your logic to send order to server
    return true;
}

async function removePendingOrder(id) {
    // Implement your logic to remove pending order
    return true;
}

// ===== LOG =====
console.log(`📦 Service Worker ${CACHE_NAME} initialized`);
console.log(`✅ ${STATIC_ASSETS.length} static assets registered`);
