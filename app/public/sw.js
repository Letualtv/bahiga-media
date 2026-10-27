/* Service worker del panel: muestra los avisos y abre el panel al tocarlos. No guarda nada en caché. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = { cuerpo: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.titulo || 'Bahiga', {
    body: d.cuerpo || '', icon: '/iconos/192.png', badge: '/iconos/insignia.png', data: { url: d.url || '/' }, tag: d.titulo, renotify: true,
  }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = new URL(e.notification.data?.url || '/', self.location.origin).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((ventanas) => {
    const v = ventanas.find((w) => w.url.startsWith(self.location.origin));
    if (v) return v.navigate(url).then((w) => (w || v).focus());
    return self.clients.openWindow(url);
  }));
});
