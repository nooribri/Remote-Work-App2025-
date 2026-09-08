const CACHE_NAME = "remote-work-app-v1";

const URLS_TO_CACHE = [
  "/remote-work-app/",
  "/remote-work-app/index.html",
  "/remote-work-app/form.html",
  "/remote-work-app/form1.html",
  "/remote-work-app/report.html",
  "/remote-work-app/report1.html",
  "/remote-work-app/manifest.json"
  // لاحقًا يمكنك إضافة:
  // "/remote-work-app/icons/icon-192.png",
  // "/remote-work-app/icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // لو الملف موجود في الكاش رجّعه، وإلا حمّله من الشبكة
      return response || fetch(event.request);
    })
  );
});
