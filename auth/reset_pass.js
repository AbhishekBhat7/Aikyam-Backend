// const express = require('express');
// const bcrypt = require('bcrypt');
// const nodemailer = require('nodemailer');
// const client = require('../db');  // Import the database client from db.js
// const dotenv = require('dotenv');
// dotenv.config();

// const router = express.Router();

// // Endpoint to request a password reset link (sends the link via email)
// router.post('/request-password-reset', async (req, res) => {
//   const { email } = req.body; // Email from the user

//   // Validate that email is provided
//   if (!email) {
//     return res.status(400).json({ message: 'Email is required' });
//   }

//   try {
//     // Check if the user exists in the database
//     const userQuery = 'SELECT * FROM users WHERE email = $1';
//     const result = await client.query(userQuery, [email]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Generate a password reset link (no token needed to store for demo purposes)
//     let transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       }
//     });

//     // Password reset link containing the email
//     const resetLink = `https://demoaikyam.azurewebsites.net/api/reset-password?email=${encodeURIComponent(email)}`;

//     await transporter.sendMail({
//       to: email,
//       subject: 'Password Reset Request',
//       text: `Click the link to reset your password: ${resetLink}`,
//     });

//     return res.status(200).json({ message: 'Password reset link has been sent to your email' });
//   } catch (error) {
//     console.error('Error during password reset request:', error.message, error.stack);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Endpoint to serve the reset password page (GET request)
// router.get('/reset-password', async (req, res) => {
//   const { email } = req.query;  // Extract email from the query string

//   // Check if the email is provided
//   if (!email) {
//     return res.status(400).json({ message: 'Email is required' });
//   }

//   try {
//     // Check if the user exists in the database
//     const userQuery = 'SELECT * FROM users WHERE email = $1';
//     const result = await client.query(userQuery, [email]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Render the password reset form
//     return res.send(`
//       <html>
//         <body>
//           <h1>Reset your password</h1>
//           <form action="/api/reset-password" method="POST">
//             <input type="hidden" name="email" value="${email}">
//             <label for="newPassword">New Password:</label>
//             <input type="password" id="newPassword" name="newPassword" required>
//             <button type="submit">Reset Password</button>
//           </form>
//         </body>
//       </html>
//     `);

//   } catch (error) {
//     console.error('Error loading reset password page:', error.message, error.stack);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Endpoint to reset the password (POST request)
// router.post('/reset-password', async (req, res) => {
//   const { email, newPassword } = req.body;

//   // Validate email and new password
//   if (!email || !newPassword) {
//     return res.status(400).json({ message: 'Email and new password are required' });
//   }

//   try {
//     // Check if the user exists in the database
//     const userQuery = 'SELECT * FROM users WHERE email = $1';
//     const result = await client.query(userQuery, [email]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Hash the new password
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

//     // Update the user's password
//     const updatePasswordQuery = 'UPDATE users SET password = $1 WHERE email = $2';
//     await client.query(updatePasswordQuery, [hashedPassword, email]);

//     return res.status(200).json({ message: 'Password reset successfully' });
//   } catch (error) {
//     console.error('Error during password reset:', error.message, error.stack);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });

// module.exports = router;



const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const client = require('../db');  // Import the database client from db.js
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

// Middleware for parsing URL-encoded form data
router.use(express.urlencoded({ extended: true })); // For parsing form data

// Endpoint to request a password reset link (sends the link via email)
router.post('/request-password-reset', async (req, res) => {
  const { email } = req.body; // Email from the user

  // Validate that email is provided
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Check if the user exists in the database
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const result = await client.query(userQuery, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a password reset link (no token needed to store for demo purposes)
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Password reset link containing the email
    const resetLink = `https://demoaikyam.azurewebsites.net/api/reset-password?email=${encodeURIComponent(email)}`;

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      text: `Click the link to reset your password: ${resetLink}`,
    });

    return res.status(200).json({ message: 'Password reset link has been sent to your email' });
  } catch (error) {
    console.error('Error during password reset request:', error.message, error.stack);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to serve the reset password page (GET request)
router.get('/reset-password', async (req, res) => {
  const { email } = req.query;  // Extract email from the query string

  // Check if the email is provided
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Check if the user exists in the database
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const result = await client.query(userQuery, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Render the password reset form
    return res.send(`
      <html>
        <body>
          <h1>Reset your password</h1>
          <form action="/api/reset-password" method="POST">
            <input type="hidden" name="email" value="${email}">
            <label for="newPassword">New Password:</label>
            <input type="password" id="newPassword" name="newPassword" required>
            <button type="submit">Reset Password</button>
          </form>
        </body>
      </html>
    `);

  } catch (error) {
    console.error('Error loading reset password page:', error.message, error.stack);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to reset the password (POST request)
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  // Validate email and new password
  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required' });
  }

  try {
    // Check if the user exists in the database
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const result = await client.query(userQuery, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password
    const updatePasswordQuery = 'UPDATE users SET password = $1 WHERE email = $2';
    await client.query(updatePasswordQuery, [hashedPassword, email]);

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error during password reset:', error.message, error.stack);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
