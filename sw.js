const CACHE_NAME = "ibrahim-portfolio-v1.0.0"
const urlsToCache = [
  "/",
  "/index.html",
  "/about.html",
  "/projects.html",
  "/skills.html",
  "/contact.html",
  "/styles.css",
  "/js/main.js",
  "/js/animations.js",
  "/js/performance.js",
  "/js/contact-form.js",
  "/js/projects.js",
  "/js/skills.js",
  "/manifest.json",
  "https://cdn.tailwindcss.com",
  "https://unpkg.com/aos@2.3.1/dist/aos.css",
  "https://unpkg.com/aos@2.3.1/dist/aos.js",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
  "https://cdn.jsdelivr.net/npm/typed.js@2.0.12",
  "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.21/vanta.net.min.js",
  "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js",
]

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache")
        return cache.addAll(urlsToCache)
      })
      .catch((error) => {
        console.error("Failed to cache resources:", error)
      }),
  )
})

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response
        }

        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (event.request.destination === "document") {
          return caches.match("/404.html")
        }
      }),
  )
})

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

// Background sync for form submissions
self.addEventListener("sync", (event) => {
  if (event.tag === "contact-form-sync") {
    event.waitUntil(syncContactForm())
  }
})

async function syncContactForm() {
  try {
    const cache = await caches.open("form-data")
    const requests = await cache.keys()

    for (const request of requests) {
      const response = await cache.match(request)
      const formData = await response.json()

      // Attempt to send the form data
      const result = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (result.ok) {
        await cache.delete(request)
        console.log("Form data synced successfully")
      }
    }
  } catch (error) {
    console.error("Failed to sync form data:", error)
  }
}

// Push notification handling
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "New update available!",
    icon: "/apple-touch-icon.png",
    badge: "/apple-touch-icon.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "View Portfolio",
        icon: "/apple-touch-icon.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/apple-touch-icon.png",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification("Ibrahim Benkacem Portfolio", options))
})

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"))
  }
})
