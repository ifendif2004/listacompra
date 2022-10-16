const STATIC_CACHE = "static-lista-compra";

const APP_SHELL = [
  "/",
  "index.html",
  "favicon.ico",
  "sw-listacompra.js",
  "manifest.json",
  "css/main.css",
  "js/app.js",
  "img/carroazul.png",
  "img/linea.png",
  "img/papeleraroja.png",
  "img/icon-72x72.png",
  "img/icon-96x96.png",
  "img/icon-128x128.png",
  "img/icon-144x144.png",
  "img/icon-152x152.png",
  "img/icon-192x192.png",
  "img/icon-384x384.png",
  "img/icon-512x512.png"
];

self.addEventListener("install", (e) => {
  const cacheStatic = caches
    .open(STATIC_CACHE)
    .then((cache) => cache.addAll(APP_SHELL));

  e.waitUntil(cacheStatic);
});

self.addEventListener("fetch", (e) => {
  // console.log("fetch! ", e.request);
  e.respondWith(
    caches
      .match(e.request)
      .then((res) => {
        return res || fetch(e.request);
      })
      .catch(console.log)
  );
  //   e.waitUntil(response);
});