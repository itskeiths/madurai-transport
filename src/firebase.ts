import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDDC9VdBI-p5402POl9Q8nGafHR8R_VqF0",
  authDomain: "madurai-one-86269.firebaseapp.com",
  projectId: "madurai-one-86269",
  storageBucket: "madurai-one-86269.firebasestorage.app",
  messagingSenderId: "610685176181",
  appId: "1:610685176181:web:e53dc02d912057a2466b3c",
  measurementId: "G-G4KTQMJC6E",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
console.log("PROJECT:", firebaseConfig.projectId);
