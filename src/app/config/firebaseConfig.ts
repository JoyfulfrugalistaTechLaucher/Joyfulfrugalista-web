import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBDlfjFF6-T3HoxQJR5vHsV9BSSPSeXmYE",
  authDomain: "joyful-429b0.firebaseapp.com",
  databaseURL:
    "https://joyful-429b0-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "joyful-429b0",
  storageBucket: "joyful-429b0.appspot.com",
  messagingSenderId: "49637931335",
  appId: "1:49637931335:android:500aec15cf39aaef1a3462",
  measurementId: "G-7749860346",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };
