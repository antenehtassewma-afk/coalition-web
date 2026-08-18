// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMbwIb6wshfrXIZ4sjMox-3elAIR4IHh8",
  authDomain: "caaa-website.firebaseapp.com",
  projectId: "caaa-website",
  storageBucket: "caaa-website.firebasestorage.app",
  messagingSenderId: "678976358381",
  appId: "1:678976358381:web:34853bb4698280e7e2c9e4"
};

// Initialize Firebase (This checks if it's already running to prevent errors)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize the Database
export const db = getFirestore(app);
export const auth = getAuth(app);