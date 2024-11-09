import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Add this
import { getFirestore } from "firebase/firestore"; // Add this
import { getDatabase } from "firebase/database"; // Add this

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzcNOSn--7-coPEfUQFEPZed8-rZCG_Z4",
  authDomain: "ecoscan-46fd4.firebaseapp.com",
  projectId: "ecoscan-46fd4",
  storageBucket: "ecoscan-46fd4.firebasestorage.app",
  messagingSenderId: "102863122828",
  appId: "1:102863122828:web:3decb47746fb604c0266a9",
  measurementId: "G-MQHELTLHDG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize Auth
const db = getFirestore(app); // Initialize Firestore
const database = getDatabase(app); // Initialize Realtime Database

export { app, auth, db, database, analytics }; // Export for use in other modules