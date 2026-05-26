import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Menggunakan Environment Variables agar API Key aman saat di-push ke GitHub
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCNvDAEHvTSQoPVFooWquv6SzsMENEsvfc",
  authDomain: "kuis-kita.firebaseapp.com",
  projectId: "kuis-kita",
  storageBucket: "kuis-kita.firebasestorage.app",
  messagingSenderId: "504408792162",
  appId: "1:504408792162:web:a470774476d7169902053b",
  measurementId: "G-B5TCWSD71R"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Ekspor database (Firestore) agar bisa dipakai di file pendaftaran/avatar Anda
export const db = getFirestore(app);