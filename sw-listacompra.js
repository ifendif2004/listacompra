const STATIC_CACHE = "lista-compra-v3";

const APP_SHELL = [
  "./",
  "./index.html",
  "./css/main.css",
  "./js/app.js",
  "./img/linea.png",
  "./img/icon-48x48.png",
  "./img/icon-72x72.png",
  "./img/icon-96x96.png",
  "./img/icon-128x128.png",
  "./img/icon-144x144.png",
  "./img/icon-152x152.png",
  "./img/icon-192x192.png",
  "./img/icon-256x256.png",
  "./img/icon-384x384.png",
  "./img/icon-512x512.png",
  "./manifest.json",
  "./favicon.ico"
];

self.addEventListener("install", (e) => {
  const cacheStatic = caches
    .open(STATIC_CACHE)
    .then((cache) => cache.addAll(APP_SHELL));

  e.waitUntil(cacheStatic);
  // Forzamos al Service Worker a instalarse inmediatamente sin esperar
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  // Borramos los cachés antiguos de versiones anteriores
  const clearCache = caches.keys().then((keys) => {
    return Promise.all(
      keys.map((key) => {
        if (key !== STATIC_CACHE && key.includes("lista-compra")) {
          return caches.delete(key);
        }
      })
    );
  });
  e.waitUntil(clearCache);
  // Reclamamos el control de la página para aplicar los cambios de inmediato
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches
      .match(e.request)
      .then((res) => {
        return res || fetch(e.request);
      })
  );
});