// const express = require('express');
// const client = require('../db'); // Assuming client is your PostgreSQL client
// const bcrypt = require('bcrypt');
// const router = express.Router();

// // Endpoint to reset the password
// router.post('/reset-password', async (req, res) => {
//   const { email, newPassword } = req.body; // Email and new password from the user

//   // Validate that email and new password are provided
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

//     // Hash the new password before storing it
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

//     // Update the user's password in the database
//     const updatePasswordQuery = 'UPDATE users SET password = $1 WHERE email = $2';
//     await client.query(updatePasswordQuery, [hashedPassword, email]);

//     return res.status(200).json({ message: 'Password reset successfully' });
//   } catch (error) {
//     console.error('Error during password reset:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });

// module.exports = router;

// const express = require('express');
// const crypto = require('crypto'); // Use the built-in crypto module
// const bcrypt = require('bcrypt');
// const nodemailer = require('nodemailer');
// const router = express.Router();
// const client = require('../db');  // Import the database client from db.js
// const dotenv = require('dotenv');
// dotenv.config(); 

// // Endpoint to request a password reset link
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

//     // Generate a token for the reset link
//     const token = crypto.randomBytes(20).toString('hex'); // Built-in crypto for token generation

//     // Store the token and its expiration in the database
//     const updateTokenQuery = 'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3';
//     const expiryTime = Date.now() + 3600000; // 1 hour expiry time
//     await client.query(updateTokenQuery, [token, expiryTime, email]);

//     let transporter = nodemailer.createTransport({
//            service: 'gmail',
//            auth: {
//                user: process.env.EMAIL_USER,
//                pass: process.env.EMAIL_PASS
//            }
//        });

//     const resetLink = `https://demoaikyam.azurewebsites.net/api/reset-password?token=${token}`;

//     await transporter.sendMail({
//       to: email,
//       subject: 'Password Reset Request',
//       text: `Click the link to reset your password: ${resetLink}`,
//     });

//     return res.status(200).json({ message: 'Password reset link has been sent to your email' });
//   } catch (error) {
//     console.error('Error during password reset request:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });


// // Endpoint to reset the password
// router.post('/reset-password', async (req, res) => {
//   const { token, newPassword } = req.body;

//   // Validate token and new password
//   if (!token || !newPassword) {
//     return res.status(400).json({ message: 'Token and new password are required' });
//   }

//   try {
//     // Check if the token is valid
//     const userQuery = 'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > $2';
//     const result = await client.query(userQuery, [token, Date.now()]);

//     if (result.rows.length === 0) {
//       return res.status(400).json({ message: 'Invalid or expired token' });
//     }

//     const email = result.rows[0].email;

//     // Hash the new password
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

//     // Update the user's password and clear the reset token
//     const updatePasswordQuery = 'UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE email = $2';
//     await client.query(updatePasswordQuery, [hashedPassword, email]);

//     return res.status(200).json({ message: 'Password reset successfully' });
//   } catch (error) {
//     console.error('Error during password reset:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });

// module.exports = router;



// const express = require('express');
// const bcrypt = require('bcrypt');
// const nodemailer = require('nodemailer');
// const router = express.Router();
// const client = require('../db');  // Import the database client from db.js
// const dotenv = require('dotenv');
// dotenv.config(); 

// // Endpoint to request a password reset link
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

//     // Generate a password reset link (no token needed to store)
//     let transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       }
//     });

//     // Assuming the password reset link does not rely on a token now
//     const resetLink = `https://demoaikyam.azurewebsites.net/api/reset-password?email=${email}`;

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

// // Endpoint to reset the password (Only new password)
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
const router = express.Router();
const client = require('../db');  // Import the database client from db.js
const dotenv = require('dotenv');
dotenv.config(); 

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

    // Generate a password reset link (no token needed to store)
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Password reset link containing the email
    const resetLink = `https://demoaikyam.azurewebsites.net/api/reset-password?email=${email}`;

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

    // You could return a reset password page here (e.g., a form where the user enters a new password)
    // For example, you could render an HTML page or send a message saying the form is ready
    // return res.status(200).json({ message: 'Please provide your new password in the request body' });
    return res.send(`
      <html>
        <body>
          <h1>Reset your password</h1>
          <form action="/api/reset-password" method="POST">
  <input type="hidden" name="email" value="{{email}}">
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
