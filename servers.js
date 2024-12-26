// const express = require('express');
// const bodyParser = require('body-parser');
// const nodemailer = require('nodemailer');
// const cors = require('cors');
// const fs = require('fs');
// const path = require('path');
// const client = require('./db'); // Importing the database pool from db.js
// const bcrypt = require('bcrypt');

// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(bodyParser.json());

// let otp = null;
// let otpEmail = null;
// let userDetails = null; // To store user data temporarily

// // Import the register file (register.js) where the registration routes are defined
// const registerRouter = require('./register');

// // Use the routes from register.js under '/api'
// app.use('/api', registerRouter);

// // Function to get HTML email template
// function getEmailHtml(otp) {
//     const template = fs.readFileSync('email-template.html', 'utf8');
//     return template.replace('{{OTP}}', otp);
// }

// // Serve the index.html on the root route
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html')); // Make sure index.html exists in the same folder
// });

// // Endpoint to send OTP
// app.post('/sendOtp', async (req, res) => {
//     const { name, email, password } = req.body;

//     if (!email) {
//         return res.status(400).send({ success: false, error: "Email not provided" });
//     }

//     otp = Math.floor(100000 + Math.random() * 900000); // Generate OTP
//     otpEmail = email;

//     // Store user details temporarily to be used after OTP verification
//     userDetails = { name, email, password };

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
//         subject: 'OTP Code for Aikyam Sports Science',
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
// // app.post('/verifyOtp', async (req, res) => {
// //     const { email, userOtp } = req.body;

// //     // Check if the OTP and email match
// //     if (email === otpEmail && userOtp == otp) {
// //         try {
// //             // Log userDetails to ensure they are correct
// //             console.log('User Details:', userDetails);

// //             // Validate that password exists
// //             if (!userDetails.password) {
// //                 return res.status(400).send({ verified: false, error: 'Password is missing' });
// //             }

// //             // Check if the email already exists in the database
// //             const existingUser = await pool.query(
// //                 'SELECT * FROM users WHERE email = $1',
// //                 [email]
// //             );

// //             if (existingUser.rows.length > 0) {
// //                 return res.status(400).send({ verified: false, error: 'Email already in use' });
// //             }

// //             // Hash the password before saving to the database
// //             const saltRounds = 10;

// //             // Ensure password is not empty and log the hashing process
// //             console.log('Password before hashing:', userDetails.password);

// //             const hashedPassword = await bcrypt.hash(userDetails.password, saltRounds);

// //             // Log the hashed password for debugging
// //             console.log('Hashed Password:', hashedPassword);

// //             // Insert the user into the database
// //             const result = await pool.query(
// //                 `INSERT INTO users (name, email, password) 
// //                  VALUES ($1, $2, $3) RETURNING id`,
// //                 [userDetails.name, email, hashedPassword]
// //             );

// //             console.log("User saved with ID:", result.rows[0].id);

// //             // Respond with success message
// //             res.send({ verified: true, message: "OTP verified and user saved successfully" });

// //         } catch (error) {
// //             console.error("Database Error:", error);  // Detailed logging
// //             res.status(500).send({ verified: false, error: "Failed to save user data", details: error.message });
// //         }
// //     } else {
// //         res.status(400).send({ verified: false, error: "OTP verification failed" });
// //     }
// // });
// // Endpoint to verify OTP and save user data
// app.post('/verifyOtp', async (req, res) => {
//     const { email, userOtp } = req.body;

//     // Check if the OTP and email match
//     if (email === otpEmail && userOtp == otp) {
//         try {
//             // Log the user details (but ensure password is not exposed)
//             console.log('User Details:', {
//                 name: userDetails.name,
//                 email: userDetails.email
//             });

//             // Validate that password exists in the userDetails
//             if (!userDetails.password) {
//                 return res.status(400).send({ verified: false, error: 'Password is missing' });
//             }

//             // Check if the email already exists in the database
//             const existingUser = await client.query(
//                 'SELECT * FROM users WHERE email = $1',
//                 [email]
//             );

//             if (existingUser.rows.length > 0) {
//                 return res.status(400).send({ verified: false, error: 'Email already in use' });
//             }

//             // Hash the password before saving to the database
//             const saltRounds = 10;

//             // Hash the password
//             const hashedPassword = await bcrypt.hash(userDetails.password, saltRounds);

//             // Log the hashed password for debugging (NEVER log plain-text passwords)
//             console.log('Hashed Password:', hashedPassword);

//             // Insert the user into the database without including the password in the userDetails object
//             const result = await client.query(
//                 `INSERT INTO users (name, email, password) 
//                  VALUES ($1, $2, $3) RETURNING id`,
//                 [userDetails.name, email, hashedPassword]
//             );

//             console.log("User saved with ID:", result.rows[0].id);

//             // Clear sensitive data after saving to ensure it's not stored in memory
//             userDetails = null; // Reset userDetails to avoid reusing it or accidentally storing sensitive data.

//             // Respond with success message
//             res.send({ verified: true, message: "OTP verified and user saved successfully" });

//         } catch (error) {
//             console.error("Database Error:", error);  // Detailed logging for debugging
//             res.status(500).send({ verified: false, error: "Failed to save user data", details: error.message });
//         }
//     } else {
//         res.status(400).send({ verified: false, error: "OTP verification failed" });
//     }
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


// const express = require('express');
// const bodyParser = require('body-parser');
// const nodemailer = require('nodemailer');
// const cors = require('cors');
// const fs = require('fs');
// const path = require('path');
// const client = require('./db'); // Importing the database pool from db.js
// const bcrypt = require('bcrypt');

// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(bodyParser.json());

// // Temporary storage for OTP and user details
// let otp = null;
// let otpEmail = null;
// let userDetails = null; // To store user data temporarily

// // Serve the index.html on the root route
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html')); // Make sure index.html exists in the same folder
// });

// // Import the register file (register.js) where the registration routes are defined
// const registerRouter = require('./register');

// // Use the routes from register.js under '/api'
// app.use('/api', registerRouter);

// // Function to get HTML email template
// function getEmailHtml(otp) {
//     const template = fs.readFileSync('email-template.html', 'utf8');
//     return template.replace('{{OTP}}', otp);
// }

// // Endpoint to send OTP
// app.post('/sendOtp', async (req, res) => {
//     const { name, email, password } = req.body;

//     if (!email) {
//         return res.status(400).send({ success: false, error: "Email not provided" });
//     }

//     otp = Math.floor(100000 + Math.random() * 900000); // Generate OTP
//     otpEmail = email;

//     // Store user details temporarily to be used after OTP verification
//     userDetails = { name, email, password };

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
//         subject: 'OTP Code for Aikyam Sports Science',
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
//     const { email, userOtp } = req.body;

//     // Check if the OTP and email match
//     if (email === otpEmail && userOtp == otp) {
//         try {
//             // Validate that userDetails contains password
//             if (!userDetails.password) {
//                 return res.status(400).send({ verified: false, error: 'Password is missing' });
//             }

//             // Check if the email already exists in the database
//             const existingUser = await client.query(
//                 'SELECT * FROM users WHERE email = $1',
//                 [email]
//             );

//             if (existingUser.rows.length > 0) {
//                 return res.status(400).send({ verified: false, error: 'Email already in use' });
//             }

//             // Hash the password before saving to the database
//             const saltRounds = 10;
//             const hashedPassword = await bcrypt.hash(userDetails.password, saltRounds);

//             // Insert the user into the database
//             const result = await client.query(
//                 `INSERT INTO users (name, email, password) 
//                  VALUES ($1, $2, $3) RETURNING id`,
//                 [userDetails.name, email, hashedPassword]
//             );

//             // Log the user ID after insertion
//             console.log("User saved with ID:", result.rows[0].id);

//             // Clear sensitive data from memory
//             userDetails = null;

//             // Respond with a success message
//             res.send({ verified: true, message: "OTP verified and user saved successfully" });

//         } catch (error) {
//             console.error("Database Error:", error);  // Detailed logging
//             res.status(500).send({ verified: false, error: "Failed to save user data", details: error.message });
//         }
//     } else {
//         res.status(400).send({ verified: false, error: "OTP verification failed" });
//     }
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });



// server.js

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const client = require('./db'); // Import the database pool from db.js
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());


app.use(express.json());  // For parsing application/json
app.use(express.urlencoded({ extended: true }));  // For parsing application/x-www-form-urlencoded
 
// Temporary storage for OTP and user details
let otp = null;
let otpEmail = null;
let userDetails = null; // To store user data temporarily

// Serve the index.html on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Make sure index.html exists in the same folder
});

// Import the register file (register.js) where the registration routes are defined
const registerRouter = require('./register');
// Use the routes from register.js under '/api'
app.use('/api', registerRouter);

//import login
const login = require('./auth/login');
app.use('/api', login);

// import the role file
const role = require('./role');
app.use('/api', role);

const details = require('./details');
app.use('/api', details);

const reset = require('./auth/reset_pass');
app.use('/api', reset);

const auth = require('./auth/auth');
app.use('/api', auth);

const auth_login = require('./auth/auth_login');
app.use('/api', auth_login);



const profile = require('./Dash/profile');
app.use('/api', profile);

// Function to get HTML email template
function getEmailHtml(otp) {
    const template = fs.readFileSync('email-template.html', 'utf8');
    return template.replace('{{OTP}}', otp);
}

// Endpoint to send OTP
app.post('/sendOtp', async (req, res) => {
    const { name, email, password } = req.body;

    if (!email) {
        return res.status(400).send({ success: false, error: "Email not provided" });
    }

    otp = Math.floor(100000 + Math.random() * 900000); // Generate OTP
    otpEmail = email;

    // Store user details temporarily to be used after OTP verification
    userDetails = { name, email, password };

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

// Endpoint to verify OTP and save user data
app.post('/verifyOtp', async (req, res) => {
    const { email, userOtp } = req.body;

    // Check if the OTP and email match
    if (email === otpEmail && userOtp == otp) {
        try {
            // Validate that userDetails contains password
            if (!userDetails.password) {
                return res.status(400).send({ verified: false, error: 'Password is missing' });
            }

            // Check if the email already exists in the database
            const existingUser = await client.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );

            if (existingUser.rows.length > 0) {
                return res.status(400).send({ verified: false, error: 'Email already in use' });
            }

            // Hash the password before saving to the database
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(userDetails.password, saltRounds);

            // Insert the user into the database
            const result = await client.query(
                `INSERT INTO users (name, email, password) 
                 VALUES ($1, $2, $3) RETURNING id`,
                [userDetails.name, email, hashedPassword]
            );

            // Log the user ID after insertion
            console.log("User saved with ID:", result.rows[0].id);

            // Clear sensitive data from memory
            userDetails = null;

            // Respond with a success message
            res.send({ verified: true, message: "OTP verified and user saved successfully" });

        } catch (error) {
            console.error("Database Error:", error);  // Detailed logging
            res.status(500).send({ verified: false, error: "Failed to save user data", details: error.message });
        }
    } else {
        res.status(400).send({ verified: false, error: "OTP verification failed" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
