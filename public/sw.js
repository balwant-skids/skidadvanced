// SKIDS Advanced Service Worker
const CACHE_NAME = 'skids-advanced-v1.0.0'
const STATIC_CACHE_NAME = 'skids-static-v1.0.0'
const DYNAMIC_CACHE_NAME = 'skids-dynamic-v1.0.0'

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/discovery',
  '/behavioral',
  '/care-plans',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Add critical CSS and JS files
  '/_next/static/css/',
  '/_next/static/js/',
]

// API endpoints to cache
const API_CACHE_PATTERNS = [
  '/api/user/profile',
  '/api/children/',
  '/api/assessments/',
  '/api/educational-content/',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('Service Worker: Static assets cached')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return
  }

  // Handle different types of requests
  if (isStaticAsset(request.url)) {
    event.respondWith(cacheFirst(request))
  } else if (isAPIRequest(request.url)) {
    event.respondWith(networkFirst(request))
  } else if (isNavigationRequest(request)) {
    event.respondWith(navigationHandler(request))
  } else {
    event.respondWith(staleWhileRevalidate(request))
  }
})

// Cache strategies
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.error('Cache first strategy failed:', error)
    return new Response('Offline content not available', { status: 503 })
  }
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log('Network failed, trying cache:', error)
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    return new Response(JSON.stringify({ error: 'Offline', cached: false }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME)
  const cachedResponse = await cache.match(request)
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  })
  
  return cachedResponse || fetchPromise
}

async function navigationHandler(request) {
  try {
    const networkResponse = await fetch(request)
    return networkResponse
  } catch (error) {
    // Return cached dashboard for offline navigation
    const cachedDashboard = await caches.match('/dashboard')
    if (cachedDashboard) {
      return cachedDashboard
    }
    
    // Fallback offline page
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SKIDS Advanced - Offline</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: system-ui; text-align: center; padding: 2rem; }
            .offline { color: #666; }
          </style>
        </head>
        <body>
          <h1>SKIDS Advanced</h1>
          <p class="offline">You're currently offline. Please check your connection.</p>
          <button onclick="window.location.reload()">Try Again</button>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    })
  }
}

// Helper functions
function isStaticAsset(url) {
  return url.includes('/_next/static/') || 
         url.includes('/icons/') || 
         url.includes('/images/') ||
         url.endsWith('.css') ||
         url.endsWith('.js') ||
         url.endsWith('.png') ||
         url.endsWith('.jpg') ||
         url.endsWith('.svg')
}

function isAPIRequest(url) {
  return url.includes('/api/') || 
         API_CACHE_PATTERNS.some(pattern => url.includes(pattern))
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'))
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag)
  
  if (event.tag === 'assessment-sync') {
    event.waitUntil(syncAssessments())
  } else if (event.tag === 'progress-sync') {
    event.waitUntil(syncProgress())
  }
})

async function syncAssessments() {
  try {
    // Sync offline assessment data
    const offlineData = await getOfflineAssessments()
    if (offlineData.length > 0) {
      await fetch('/api/assessments/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offlineData)
      })
      await clearOfflineAssessments()
    }
  } catch (error) {
    console.error('Failed to sync assessments:', error)
  }
}

async function syncProgress() {
  try {
    // Sync offline progress data
    const offlineProgress = await getOfflineProgress()
    if (offlineProgress.length > 0) {
      await fetch('/api/progress/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offlineProgress)
      })
      await clearOfflineProgress()
    }
  } catch (error) {
    console.error('Failed to sync progress:', error)
  }
}

// IndexedDB helpers for offline data
async function getOfflineAssessments() {
  // Implementation for retrieving offline assessment data
  return []
}

async function clearOfflineAssessments() {
  // Implementation for clearing synced assessment data
}

async function getOfflineProgress() {
  // Implementation for retrieving offline progress data
  return []
}

async function clearOfflineProgress() {
  // Implementation for clearing synced progress data
}

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received')
  
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Dashboard',
        icon: '/icons/dashboard-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/close-96x96.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('SKIDS Advanced', options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked')
  
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    )
  }
})
