/* Generato da build.py — non modificare a mano */
const CACHE = "viaggio-cina-b44657e74a";
const FILE = [
  "./",
  "./audio/messaggio_colleghi.mp3",
  "./css/style.css",
  "./fonts/pennello.woff2",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./index.html",
  "./js/app.js",
  "./js/audio-frasi.js",
  "./js/config.js",
  "./js/contenuti.js",
  "./js/itinerario.js",
  "./manifest.webmanifest"
];
self.addEventListener("install", e => {
  // cache: "reload" = scarica sempre dal server, mai dalla memoria temporanea del browser
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILE.map(u => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).catch(() => caches.match("./index.html"))));
});
