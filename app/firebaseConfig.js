// app/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); // Database instance

// Function to write data to the database
function writeData(path, data) {
  const dataRef = ref(db, path);
  set(dataRef, data).catch((error) => {
    console.error("Error writing data to Firebase:", error);
  });
}

// Function to listen for real-time updates
function listenToData(path, callback) {
  const dataRef = ref(db, path);
  onValue(dataRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      console.warn("No data found at path:", path);
    }
  });
}

// Export Firebase services and functions
export { app, db, getDatabase, writeData, listenToData };
