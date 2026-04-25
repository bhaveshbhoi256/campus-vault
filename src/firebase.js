// firebase.js — Sets up your connection to Firebase.
// You'll replace the firebaseConfig values with your own from the Firebase Console.

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// 🔴 REPLACE THESE VALUES with your own Firebase project config
// (Firebase Console → Project Settings → Your Apps → SDK setup)
const firebaseConfig = {
  apiKey: "AIzaSyBJttR8HBnl3ROVchx4lDu4iQHoUNwjTmc",
  authDomain: "campus-vault-5debf.firebaseapp.com",
  projectId: "campus-vault-5debf",
  storageBucket: "campus-vault-5debf.firebasestorage.app",
  messagingSenderId: "752046516109",
  appId: "1:752046516109:web:a5e72abfa318c832ad7fc4",
};

// Initialize Firebase app with our config
const app = initializeApp(firebaseConfig);

// Export the three services we'll use throughout the app
export const auth = getAuth(app);         // for login/signup
export const db = getFirestore(app);      // for storing note metadata

