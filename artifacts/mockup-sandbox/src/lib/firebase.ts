import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCvDejJHuwi-w9mlDkOADCYhex0r01ljgU",
  authDomain: "oman-tmoel.firebaseapp.com",
  databaseURL: "https://oman-tmoel-default-rtdb.firebaseio.com",
  projectId: "oman-tmoel",
  storageBucket: "oman-tmoel.firebasestorage.app",
  messagingSenderId: "258014180602",
  appId: "1:258014180602:web:22615c967c8d8e60914543",
  measurementId: "G-BFJ7K1BM6S",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
