import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCGZsuzsiQ1mgpBULkQEqAr0ywi-ER91d4",
  authDomain: "mypod-shop.firebaseapp.com",
  projectId: "mypod-shop",
  storageBucket: "mypod-shop.firebasestorage.app",
  messagingSenderId: "105727840696",
  appId: "1:105727840696:web:d90be4cd3e1a285b927f4d",
  measurementId: "G-PBRP9GE9TG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
