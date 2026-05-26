import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "kuis-kita.firebaseapp.com",
  projectId: "kuis-kita",
  storageBucket: "kuis-kita.appspot.com",
  messagingSenderId: "504408792162",
  appId: "1:504408792162:web:a470774476d7169902053b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
