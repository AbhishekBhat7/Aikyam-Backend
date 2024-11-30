// const express = require('express');
// const bodyParser = require('body-parser');
// const nodemailer = require('nodemailer');
// const cors = require('cors');
// const fs = require('fs');
// const { Pool } = require('pg'); // PostgreSQL client

// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(bodyParser.json());

// let otp = null;
// let otpEmail = null;

// // PostgreSQL Database Pool
// const pool = new Pool({
//     user: process.env.PG_USER,       // PostgreSQL username
//     host: process.env.PG_HOST,       // PostgreSQL host
//     database: process.env.PG_DB,     // PostgreSQL database name
//     password: process.env.PG_PASS,   // PostgreSQL password
//     port: process.env.PG_PORT || 5432,
// });

// // Function to get HTML email template
// function getEmailHtml(otp) {
//     const template = fs.readFileSync('email_template.html', 'utf8');
//     return template.replace('{{OTP}}', otp);
// }

// // Endpoint to send OTP
// app.post('/sendOtp', async (req, res) => {
//     const email = req.body.email;

//     if (!email) {
//         return res.status(400).send({ success: false, error: "Email not provided" });
//     }

//     otp = Math.floor(100000 + Math.random() * 900000); // Generate OTP
//     otpEmail = email;

//     let transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS
//         }
//     });

//     let mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: 'OTP Code for Aikyam',
//         html: getEmailHtml(otp)
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         res.send({ success: true, message: "OTP sent successfully" });
//     } catch (error) {
//         console.error("Error sending email:", error);
//         res.status(500).send({ success: false, error: error.message });
//     }
// });

// // Endpoint to verify OTP and save user data
// app.post('/verifyOtp', async (req, res) => {
//     const { email, userOtp, fullName, contactNumber } = req.body;

//     if (email === otpEmail && userOtp == otp) {
//         try {
//             // Insert user data into database
//             const result = await pool.query(
//                 `INSERT INTO users (email, full_name, contact_number)
//                  VALUES ($1, $2, $3) RETURNING id`,
//                 [email, fullName, contactNumber]
//             );

//             console.log("User saved with ID:", result.rows[0].id);
//             res.send({ verified: true, message: "OTP verified and user saved successfully" });
//         } catch (error) {
//             console.error("Database Error:", error);
//             res.status(500).send({ verified: false, error: "Failed to save user data" });
//         }
//     } else {
//         res.status(400).send({ verified: false, error: "OTP verification failed" });
//     }
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Sender server is running on port ${PORT}`);
// });
