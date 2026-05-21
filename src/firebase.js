import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // 🟢 Auth ইম্পোর্ট করুন

const firebaseConfig = {
  apiKey: "AIzaSyCf6cTD0ku6rLwO8Plg4hDdfHJ82xhoaO4",
  authDomain: "react-app-dcde9.firebaseapp.com",
  projectId: "react-app-dcde9",
  storageBucket: "react-app-dcde9.firebasestorage.app",
  messagingSenderId: "307713227915",
  appId: "1:307713227915:web:62490fa6c7decbe3cd688e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); // 🟢 Auth এক্সপোর্ট করুন