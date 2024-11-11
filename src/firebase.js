import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Importa Firestore

const firebaseConfig = {
  apiKey: "AIzaSyAdw1ZXIVKDFd4Mir6eOX-6ezc5lgHfBKs",
  authDomain: "timeroster-fb2bf.firebaseapp.com",
  projectId: "timeroster-fb2bf",
  storageBucket: "timeroster-fb2bf.appspot.com",
  messagingSenderId: "83599243047",
  appId: "1:83599243047:web:e83a721aae993fae849b02"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Exporta Firestore
