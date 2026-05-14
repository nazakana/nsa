// 1. Import script Firebase (Versi Compat agar stabil di background)
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// 2. Konfigurasi Firebase Nurjaya Smart Archive - SESUAI DATA KAMU
const firebaseConfig = {
  apiKey: "AIzaSyAAVlFcF5gs5ik0ESDg1Ka0Mxuy8Hh6uw8",
  authDomain: "nurjaya-smart-archive.firebaseapp.com",
  projectId: "nurjaya-smart-archive",
  storageBucket: "nurjaya-smart-archive.firebasestorage.app", // Sudah diupdate
  messagingSenderId: "930477308354",
  appId: "1:930477308354:web:b69a818a7ff73eb88f3e5b"
};

// 3. Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 4. Menangani Notifikasi saat Browser di Latar Belakang
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Pesan masuk di background: ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/nsa/logo.png', // Sesuaikan jika ada file logo
    data: {
      url: "https://nazakana.github.io/nsa/"
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 5. Efek klik pada notifikasi: Membuka web NSA
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("https://nazakana.github.io/nsa/")
  );
});
