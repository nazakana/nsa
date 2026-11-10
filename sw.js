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

// 3. Menangani Notifikasi Latar Belakang (Cegah Notifikasi Dobel)
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Pesan background masuk:', payload);

  // Jika payload membawa objek 'notification', Firebase SDK / Browser akan menampilkannya secara otomatis.
  // Hentikan eksekusi di sini agar tidak memicu showNotification() manual yang menyebabkan notifikasi ganda.
  if (payload.notification) {
    console.log('[sw.js] Ditangani otomatis oleh Firebase SDK, skip manual showNotification.');
    return;
  }

  // Baris di bawah HANYA dipanggil jika backend mengirim payload tipe 'data' murni (tanpa objek notification)
  const title = payload.data?.title || "Notifikasi NSA";
  const clickUrl = payload.data?.url || payload.fcmOptions?.link || "https://nazakana.github.io/nsa/";

  const notificationOptions = {
    body: payload.data?.body || "Ada pembaruan informasi baru.",
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    vibrate: [200, 100, 200],
    tag: payload.data?.tag || 'nsa-notification',
    renotify: true,
    data: {
      url: clickUrl
    }
  };

  return self.registration.showNotification(title, notificationOptions);
});

// 4. Efek klik notifikasi
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  const targetUrl = event.notification.data?.url || "https://nazakana.github.io/nsa/";

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // Jika tab NSA sudah terbuka di browser/PWA, langsung fokuskan ke tab tersebut
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes('nazakana.github.io/nsa') && 'focus' in client) {
          return client.focus();
        }
      }
      // Jika tab belum terbuka, buka window/tab baru
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
