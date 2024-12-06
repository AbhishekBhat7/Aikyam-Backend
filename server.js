const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const { Pool } = require('pg'); // PostgreSQL client
const path = require('path');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let otp = null;
let otpEmail = null;

// PostgreSQL Database Pool
const pool = new Pool({
    user: process.env.DB_USER,       // PostgreSQL username
    host: process.env.DB_HOST,       // PostgreSQL host
    database: process.env.DB_NAME,     // PostgreSQL database name
    password: process.env.DB_PASSWORD,   // PostgreSQL password
    port: process.env.DB_PORT || 5432,
});
 
// Function to get HTML email template
function getEmailHtml(otp) {
    const template = fs.readFileSync('email-template.html', 'utf8');
    return template.replace('{{OTP}}', otp);
}
// Serve the index.html on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Make sure index.html exists in the same folder
});
// Endpoint to send OTP
app.post('/sendOtp', async (req, res) => {
    const email = req.body.email;

    if (!email) {
        return res.status(400).send({ success: false, error: "Email not provided" });
    }

    otp = Math.floor(100000 + Math.random() * 900000); // Generate OTP
    otpEmail = email;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'OTP Code for Aikyam Sports Science',
        html: getEmailHtml(otp)
    };

    try {
        await transporter.sendMail(mailOptions);
        res.send({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send({ success: false, error: error.message });
    }
});

// app.use(cors({
//     origin: '*', // Allow all origins or set specific origins
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   }));
//   app.use((req, res, next) => {
//     console.log(`${req.method} ${req.url}`);
//     next();
//   });

// Endpoint to verify OTP and save user data
app.post('/verifyOtp', async (req, res) => {
    const { email, userOtp } = req.body;

    if (email === otpEmail && userOtp == otp) {
        try {
            // Insert user data into database
            // const result = await pool.query(
            //     `INSERT INTO users (email, full_name, contact_number)
            //      VALUES ($1, $2, $3) RETURNING id`,
            //     [email, fullName, contactNumber]
            // );
            const result = await pool.query(
                `INSERT INTO users (email)
                 VALUES ($1) RETURNING id`,
                [email] // this is the email from the request body
            );
            // const result = await pool.query(
            //     `INSERT INTO users (email)
            //      VALUES ($1)
            //      ON CONFLICT (email) DO NOTHING
            //      RETURNING id`,
            //     [email]
            // );
            console.log("User saved with ID:", result.rows[0].id);
            res.send({ verified: true, message: "OTP verified and user saved successfully" });
        } 
        
        catch (error) {
            console.error("Database Error:", error);
            console.error("Error Code:", error.code); // PostgreSQL error code
            console.error("Error Message:", error.message); // Specific error message
            console.error("Error Stack:", error.stack); // Stack trace
            console.error("Database Error:", error);
            res.status(500).send({ verified: false, error: "Failed to save user data" });
            
        }
    } else {
        res.status(400).send({ verified: false, error: "OTP verification failed" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
