const CACHE = 'taskbasehq-v2';
const STATIC = [
  '/',
  '/dashboard.html',
  '/login.html',
  '/pricing.html',
  '/tools.js',
  '/manifest.json',
  '/favicon.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC.map(u => new Request(u, {cache:'reload'}))))
    .catch(() => {}) // Don't fail install if some assets missing
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Only cache GET requests, skip API calls
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('/api/')) return;
  if (e.request.url.includes('firebase') || e.request.url.includes('gstatic')) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
