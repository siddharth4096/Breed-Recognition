// sw.js
const CACHE_NAME = "sih-flw-v1";

const FILES_TO_CACHE = [
 
  
  "/Breed-Recognition/index.html",
  "/Breed-Recognition/welcome-page-style.css",
  "/Breed-Recognition/welcome-page-script.js",
  "/Breed-Recognition/loader.css",
  "/Breed-Recognition/loader.js",

  "/Breed-Recognition/flw-login-page.html",
  "/Breed-Recognition/flw-script.js",
  "/Breed-Recognition/common-login-style.css",

  "/Breed-Recognition/flw-dashboard/test.html",
  "/Breed-Recognition/flw-dashboard/test-style.css",
  "/Breed-Recognition/flw-dashboard/test-script.js",
];


























// Install - cache all FLW files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Caching FLW portal + dashboard files...");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch - serve from cache first, then network
// Fetch - only cache FLW + Welcome files, others always online
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  if (
    url.pathname === "/" ||                          // root (index.html)
    url.pathname.startsWith("/index.html") ||        // explicit welcome page
    url.pathname.startsWith("/welcome-page-style.css") ||
    url.pathname.startsWith("/welcome-page-script.js") ||
    url.pathname.startsWith("/loader.css") ||
    url.pathname.startsWith("/loader.js") ||
    url.pathname.startsWith("/flw-dashboard/")       // FLW offline pages
  ) {
    // Serve from cache first
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
  } else {
    // Always network for Admin & Vet
    event.respondWith(fetch(event.request));
  }
});


