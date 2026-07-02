// そだてノート: Service Worker
// index.html と同じフォルダに置いてください(GitHub Pagesのルート直下など)

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// オフラインキャッシュは行わず、通常のfetchをそのまま素通しする
self.addEventListener('fetch', (e) => {});

// プッシュ通知を受け取ったら表示する
self.addEventListener('push', (event) => {
  let payload = { title: 'そだてノート', body: '新しいお知らせがあるよ' };
  try {
    if (event.data) payload = event.data.json();
  } catch (e) {
    if (event.data) payload.body = event.data.text();
  }
  const title = payload.title || 'そだてノート';
  const options = {
    body: payload.body || '',
    icon: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Crect width=\'100\' height=\'100\' rx=\'20\' fill=\'%233E5C76\'/%3E%3Ctext x=\'50\' y=\'68\' font-size=\'55\' text-anchor=\'middle\'%3E%F0%9F%8C%B1%3C/text%3E%3C/svg%3E',
    badge: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Crect width=\'100\' height=\'100\' rx=\'20\' fill=\'%233E5C76\'/%3E%3C/svg%3E',
    data: { url: payload.url || './' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// 通知タップで既存タブにフォーカス(なければ新規で開く)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});
