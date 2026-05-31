/**
 * sw.js — Service Worker
 * Uygulamayı offline çalıştırmak ve hızlı açılış için cache'ler.
 */

const CACHE_NAME = 'emo-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/config.js',
  '/face.js',
  '/body.js',
  '/speech.js',
  '/app.js',
  '/touch.js',
  '/star.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Nunito:wght@600;700&display=swap'
];

/* Kurulum — tüm statik dosyaları cache'e al */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

/* Aktivasyon — eski cache'leri temizle */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* Fetch — cache-first, API isteklerini her zaman ağdan al */
self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Groq API isteklerini cache'leme, her zaman ağdan al
  if (url.includes('api.groq.com')) {
    e.respondWith(fetch(e.request));
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
