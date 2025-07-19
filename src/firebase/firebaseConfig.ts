// src/firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // ✅ Add this for Realtime DB
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCOY2o5xM_syVDmbuVL9w_1TXsoOVYOHCQ",
  authDomain: "art-blitz.firebaseapp.com",
  databaseURL: "https://art-blitz-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "art-blitz",
  storageBucket: "art-blitz.appspot.com",
  messagingSenderId: "1043039989819",
  appId: "1:1043039989819:web:08a20a63e885ecf40fec1e",
  measurementId: "G-ZC7PBFG7Y2"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Database, Storage, Analytics
export const database = getDatabase(app);
export const storage = getStorage(app);
const analytics = getAnalytics(app); // Optional
