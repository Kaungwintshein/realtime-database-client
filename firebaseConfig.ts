import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  databaseURL: "https://sshr-test.asia-southeast1.firebasedatabase.app",
  apiKey: "AIzaSyBpSIklfVj0gIUQPCjxWCDKtQdrwEYex90",
  authDomain: "realtime-database-testin-2aa07.firebaseapp.com",
  projectId: "realtime-database-testin-2aa07",
  storageBucket: "realtime-database-testin-2aa07.firebasestorage.app",
  messagingSenderId: "697758826946",
  appId: "1:697758826946:web:5991bc328e21cbe543565b",
  measurementId: "G-PPE23CFMTY",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
console.log("Firebase initialized successfully");

const database = getDatabase(app);
console.log("Firebase Realtime Database connected successfully");

// Log the database name
const databaseURL = firebaseConfig.databaseURL;
const databaseName = databaseURL.split("//")[1].split(".")[0];
console.log("Firebase Realtime Database name:", databaseName);

export { database };
