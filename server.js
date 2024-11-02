// server.js
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK with service account
const serviceAccount = require("C:/Users/User/Documents/GitHub/material-dashboard-react-main/src/config/accountFile.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Firebase Auth Server!");
});

// Test route
app.get("/test", (req, res) => {
  res.send("Test route is working!");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Use Firebase Admin SDK to verify the user's email and password
    const user = await admin.auth().getUserByEmail(email);
    // If the user is found, respond with their UID
    return res.status(200).json({ uid: user.uid });
  } catch (error) {
    // If there’s an error (e.g., user not found), respond with an error message
    res.status(400).json({ error: "Invalid email or password." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
