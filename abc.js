// const express = require('express');
// const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt');
// const nodemailer = require('nodemailer');
// const cors = require('cors');
// const fs = require('fs');
// const path = require('path');
// // const pool = require('./db'); // Import the database pool from db.js
// const client = require('./db'); // Import the client from db.js for register

// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(bodyParser.json());

// let otp = null;
// let otpEmail = null;

// // Function to get HTML email template for OTP
// function getEmailHtml(otp) {
//   const template = fs.readFileSync('email-template.html', 'utf8');
//   return template.replace('{{OTP}}', otp);
// }

// // Register endpoint to handle new user registration
// app.post('/api/register', async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     // Check if user already exists in the database
//     const checkQuery = 'SELECT * FROM users WHERE email = $1';
//     const checkResult = await client.query(checkQuery, [email]);

//     if (checkResult.rows.length > 0) {
//       return res.status(400).json({ status: 'error', message: 'User already exists' });
//     }

//     // Hash the password before saving
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Insert the new user into the database
//     const insertQuery = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';
//     const insertResult = await client.query(insertQuery, [name, email, hashedPassword]);

//     const newUser = insertResult.rows[0];

//     // Respond with the user ID
//     res.status(200).json({
//       status: 'success',
//       user_id: newUser.id,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: 'error', message: 'Internal Server Error' });
//   }
// });

// // Serve the index.html on the root route
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html')); // Make sure index.html exists in the same folder
// });

// // Endpoint to send OTP
// app.post('/sendOtp', async (req, res) => {
//   const email = req.body.email;

//   if (!email) {
//     return res.status(400).send({ success: false, error: "Email not provided" });
//   }

//   otp = Math.floor(100000 + Math.random() * 900000); // Generate OTP
//   otpEmail = email;

//   let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS
//     }
//   });

//   let mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: 'OTP Code for Aikyam Sports Science',
//     html: getEmailHtml(otp)
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.send({ success: true, message: "OTP sent successfully" });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     res.status(500).send({ success: false, error: error.message });
//   }
// });

// // Endpoint to verify OTP and save user data
// app.post('/verifyOtp', async (req, res) => {
//   const { email, userOtp } = req.body;

//   if (email === otpEmail && userOtp == otp) {
//     try {
//       // Insert user data into database
//       const result = await pool.query(
//         `INSERT INTO users (email)
//          VALUES ($1) RETURNING id`,
//         [email] // this is the email from the request body
//       );
//       console.log("User saved with ID:", result.rows[0].id);
//       res.send({ verified: true, message: "OTP verified and user saved successfully" });
//     } catch (error) {
//       console.error("Database Error:", error);
//       res.status(500).send({ verified: false, error: "Failed to save user data" });
//     }
//   } else {
//     res.status(400).send({ verified: false, error: "OTP verification failed" });
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
