import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCzcNOSn--7-coPEfUQFEPZed8-rZCG_Z4",
  authDomain: "ecoscan-46fd4.firebaseapp.com",
  databaseURL: "https://ecoscan-46fd4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ecoscan-46fd4",
  storageBucket: "ecoscan-46fd4.firebasestorage.app",
  messagingSenderId: "102863122828",
  appId: "1:102863122828:web:3decb47746fb604c0266a9",
  measurementId: "G-MQHELTLHDG",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);

export { app, auth, db, database, analytics };
