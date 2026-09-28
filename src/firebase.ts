import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase web application configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAYM88jBlxwjGJRa0hjqURyXNYuql_qQLE",
  authDomain: "fir-87752.firebaseapp.com",
  projectId: "fir-87752",
  storageBucket: "fir-87752.firebasestorage.app",
  messagingSenderId: "78043833463",
  appId: "1:78043833463:web:80f654a3bba0dc5f5d9272",
  measurementId: "G-JMFW5L71T6"
};

// Initialize Firebase (singleton pattern to avoid duplicate initialization)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication
export const auth = getAuth(app);
