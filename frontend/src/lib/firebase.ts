import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "carbonfootprint-26d84",
  appId: "1:851928194211:web:0e2f2c3fe996b85c963316",
  databaseURL: "https://carbonfootprint-26d84-default-rtdb.firebaseio.com",
  storageBucket: "carbonfootprint-26d84.firebasestorage.app",
  apiKey: "AIzaSyBcpvdy0Z1kUeRbp39ehFF_RmFQSu6KIOY",
  authDomain: "carbonfootprint-26d84.firebaseapp.com",
  messagingSenderId: "851928194211",
  measurementId: "G-DH4FPZFD7Y",
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
