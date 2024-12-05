const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const path = require('path'); // Importing the 'path' module
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Global variables for OTP
let otp = null;
let otpEmail = null;

// Function to generate email content from template
function getEmailHtml(otp) {
    const templatePath = path.join(__dirname, 'email-template.html'); // Ensure path is correct
    const template = fs.readFileSync(templatePath, 'utf8');
    return template.replace('{{OTP}}', otp);
}

// Serve the index.html on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Make sure index.html exists in the same folder
});

// Route to send OTP
app.post('/sendOtp', async (req, res) => {
    const email = req.body.email;
    console.log("Email received:", email);

    if (!email) {
        return res.send({ success: false, error: "Email not provided" });
    }

    otp = Math.floor(100000 + Math.random() * 900000);
    otpEmail = email;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Make sure .env file is configured with EMAIL_USER and EMAIL_PASS
            pass: process.env.EMAIL_PASS
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'OTP for Aikyam Sports Science',
        html: getEmailHtml(otp)
    };

    try {
        await transporter.sendMail(mailOptions);
        res.send({ success: true });
    } catch (error) {
        console.error("Error sending email:", error);
        res.send({ success: false, error: error.message });
    }
});
app.use(cors({
    origin: '*', // Allow all origins or set specific origins
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
  

// Route to verify OTP
app.post('/verifyOtp', (req, res) => {
    const { email, userOtp } = req.body;
    if (email === otpEmail && userOtp == otp) {
        res.send({ verified: true });
    } else {
        res.send({ verified: false });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
