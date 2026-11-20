/* Service worker khusus Kalkulator Hak Pekerja.
   Cakupannya hanya /kalkulator-hak-pekerja*, halaman lain di situs tidak terpengaruh.
   Halaman diambil dari jaringan lebih dulu, jadi pembaruan langsung tampil;
   salinan cadangan dipakai saat perangkat offline. */
const CACHE = 'kalkulator-hak-pekerja-v1';
const CORE = ['/kalkulator-hak-pekerja.html', '/kalkulator.webmanifest', '/favicon.ico', '/apple-touch-icon.png',
  '/icons-kalkulator/icon-192.png', '/icons-kalkulator/icon-512.png', '/icons-kalkulator/maskable-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('kalkulator-hak-pekerja-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put('/kalkulator-hak-pekerja.html', copy)); return r; })
      .catch(() => caches.match('/kalkulator-hak-pekerja.html')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r && (r.ok || r.type === 'opaque')) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return r;
  })));
});
