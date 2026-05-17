// 1. Import script Firebase (Versi Compat)
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// 2. Konfigurasi Firebase (Harus sama persis dengan index.html)
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

// 4. Menangani Notifikasi saat Browser di Background
messaging.onBackgroundMessage((payload) => {
  console.log('Isi payload:', JSON.stringify(payload));
  console.log('[sw.js] Pesan background masuk:', payload);

  // JIKA payload dikirim via Apps Script menggunakan objek 'notification' bawaan Firebase,
  // hentikan fungsi ini agar browser tidak memicu notifikasi manual kedua (mencegah duplikat).
  if (payload.notification) {
    console.log('[sw.js] Ditangani otomatis oleh Firebase SDK, skip manual showNotification.');
    return;
  }

  // Logika di bawah ini HANYA akan berjalan jika di masa depan kamu mengirimkan payload tipe 'data' murni
  const notificationTitle = payload.data?.title || "Notifikasi NSA";
  const notificationOptions = {
    body: payload.data?.body || "Ada pesan baru untukmu.",
    icon: 'icon-192.png', 
    badge: 'icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      url: payload.data?.url || "https://nazakana.github.io/nsa/"
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 5. Efek klik pada notifikasi
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  // Ambil URL tujuan, jika tidak ada fallback ke halaman utama NSA
  const targetUrl = event.notification.data?.url || "https://nazakana.github.io/nsa/";
  
  event.waitUntil(
    clients.openWindow(targetUrl)
  );
});
