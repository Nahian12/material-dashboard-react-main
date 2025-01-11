// server.js
const express = require("express");
const cors = require("cors");
const nodemailer = require('nodemailer');
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
    const user = await admin.auth().getUserByEmail(email);
    return res.status(200).json({ uid: user.uid });
  } catch (error) {
    res.status(400).json({ error: "Invalid email or password." });
  }
});

const transporter = nodemailer.createTransport({
  service: 'yahoo',
  auth: {
    user: 'nahian3@yahoo.com', // Replace with your email
    pass: 'ingxusrppamthuxz', // Replace with your email password
  },
});

app.post('/send-email', (req, res) => {
  const { email, subject, text } = req.body;

  const mailOptions = {
    from: 'nahian3@yahoo.com', // Replace with your email
    to: email,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error); 
      return res.status(500).json({ error: error.toString() });
    }
    res.status(200).json({ message: 'Email sent successfully' });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
