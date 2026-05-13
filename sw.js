// sw.js

// Memaksa Service Worker baru langsung aktif tanpa menunggu user menutup tab
self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
    console.log('Service Worker Aktif & Siap!');
});

// Listener untuk menangani klik pada notifikasi
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/') // Membuka aplikasi saat notif diklik
    );
});

// Tetap pertahankan fetch listener jika Anda membutuhkannya nanti
self.addEventListener('fetch', event => {
    // Kosong tidak apa-apa untuk saat ini
});
