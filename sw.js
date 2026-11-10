// 1. Import script Firebase (Versi Compat)
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// 2. Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAAVlFcF5gs5ik0ESDg1Ka0Mxuy8Hh6uw8",
  authDomain: "nurjaya-smart-archive.firebaseapp.com",
  projectId: "nurjaya-smart-archive",
  storageBucket: "nurjaya-smart-archive.firebasestorage.app",
  messagingSenderId: "930477308354",
  appId: "1:930477308354:web:b69a818a7ff73eb88f3e5b"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 3. Menangani Notifikasi Latar Belakang (Fix Anti-Gagal & Anti-Dobel)
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Pesan background masuk:', payload);

  // Ambil isi teks baik dari payload.notification maupun payload.data
  const title = payload.notification?.title || payload.data?.title || "Notifikasi NSA";
  const body = payload.notification?.body || payload.data?.body || "Ada pembaruan informasi baru.";
  const clickUrl = payload.data?.url || payload.fcmOptions?.link || "https://nazakana.github.io/nsa/";

  // Gunakan ID/Tag unik atau bawaan pesan agar browser menimpa notifikasi bawaan SDK (mencegah dobel)
  const notificationTag = payload.data?.tag || payload.messageId || 'nsa-single-notification';

  const notificationOptions = {
    body: body,
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    vibrate: [200, 100, 200],
    tag: notificationTag, // KUNCI ANTI-DOBEL: menimpa notifikasi dengan tag sama
    renotify: true,
    data: {
      url: clickUrl
    }
  };

  // Paksa tampilkan 1 notifikasi secara eksplisit
  return self.registration.showNotification(title, notificationOptions);
});

// 4. Efek klik notifikasi
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  const targetUrl = event.notification.data?.url || "https://nazakana.github.io/nsa/";

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // Jika tab NSA sudah terbuka, fokuskan tab tersebut
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes('nazakana.github.io/nsa') && 'focus' in client) {
          return client.focus();
        }
      }
      // Jika belum terbuka, buka window baru
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
