// قم بزيادة رقم الإصدار (v2 -> v3) عند إجراء تعديلات كبيرة
const CACHE_NAME = "remote-work-app-v2";

// استخدام مسارات نسبية ليكون التطبيق حراً ومفتوحاً على أي مجلد
const URLS_TO_CACHE = [
  "./",
  "./index.html",
  "./form.html",
  "./form1.html",
  "./report.html",
  "./report1.html",
  "./manifest.json"
];

// تثبيت الـ Service Worker وتخزين الملفات الأساسية
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting(); // فرض التفعيل فوراً وتخطي الانتظار
});

// تنشيط وحذف الكاش القديم بالكامل
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
  self.clients.claim(); // السيطرة المباشرة على كل الصفحات المفتوحة
});

// استراتيجية (Network First): فحص السيرفر أولاً للتحديث ثم الكاش
self.addEventListener("fetch", event => {
  // تجاهل طلبات Google Apps Script والطلبات الخارجية
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // إذا نجح الاتصال، خزن النسخة الأحدث في الكاش وارجعها للمستخدم
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // في حال انقطاع الإنترنت، يتم جلب الصفحة من الكاش المخزن
        return caches.match(event.request);
      })
  );
});