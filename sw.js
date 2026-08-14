const CACHE_NAME = 'stack-completa-java-v17';
const COURSE_FILES = ['./', './index.html', './vendor/marked.umd.js', './vendor/purify.min.js', './curriculum-v2.js', './app.js', './manifest.webmanifest', './icon.svg'];

async function fetchWithTimeout(request, timeoutMs = 3500) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(request, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function cacheCourse() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(COURSE_FILES);
}

self.addEventListener('install', event => {
  event.waitUntil(cacheCourse().then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith('stack-completa-java-') && name !== CACHE_NAME).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'CACHE_COURSE') event.waitUntil(cacheCourse());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetchWithTimeout(event.request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put('./index.html', response.clone());
        }
        return response;
      } catch {
        return (await caches.match(event.request)) || (await caches.match('./index.html'));
      }
    })());
    return;
  }

  event.respondWith((async () => {
    try {
      const response = await fetchWithTimeout(event.request);
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, response.clone());
      }
      return response;
    } catch {
      return (await caches.match(event.request)) || new Response('Recurso indisponível offline.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }
  })());
});
