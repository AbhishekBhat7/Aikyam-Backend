// const express = require('express');
// const client = require('../db');
// const bodyParser = require('body-parser');
// const app = express();
// const router = express.Router();

// client.connect()
//   .then(() => console.log('Connected to PostgreSQL'))
//   .catch((err) => console.error('Connection error', err.stack));

// // Middleware to parse JSON bodies
// app.use(bodyParser.json());

// // Login user endpoint
// router.post('/authlogin', async (req, res) => {
//   const { email, firebase_uid } = req.body;

//   if (!email && !firebase_uid) {
//     return res.status(400).json({ message: 'Email or firebase_uid is required' });
//   }

//   try {
//     // Check if the user exists with either email or firebase_uid
//     const checkQuery = `
//       SELECT id, email, name, firebase_uid
//       FROM users
//       WHERE email = $1 OR firebase_uid = $2
//     `;
//     const checkValues = [email, firebase_uid];
//     const checkResult = await client.query(checkQuery, checkValues);

//     if (checkResult.rows.length === 0) {
//       // No user found
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const user = checkResult.rows[0];
//     console.log(`User logged in with ID: ${user.id}`);

//     // Send a response with the userId, email, and firebase_uid
//     return res.status(200).json({
//       message: 'Login successful',
//       userId: user.id,
//       email: user.email,
//       name: user.name,
//       firebase_uid: user.firebase_uid
//     });

//   } catch (err) {
//     console.error('Error during database query:', err);
//     return res.status(500).json({ message: 'Error during login' });
//   }
// });

// module.exports = router;

// const express = require('express');
// const client = require('../db'); // Assuming client is your PostgreSQL client
// const bodyParser = require('body-parser');
// const app = express();
// const router = express.Router();

// // Middleware to parse JSON bodies
// app.use(bodyParser.json());

// // Connect to PostgreSQL
// client.connect()
//   .then(() => console.log('Connected to PostgreSQL'))
//   .catch((err) => console.error('Connection error', err.stack));

// // Login user endpoint
// router.post('/authlogin', async (req, res) => {
//   const { email, firebase_uid } = req.body;

//   if (!email && !firebase_uid) {
//     return res.status(400).json({ message: 'Email or firebase_uid is required' });
//   }

//   try {
//     // Check if the user exists with either email or firebase_uid
//     const checkQuery = `
//       SELECT id, email, name, firebase_uid
//       FROM users
//       WHERE email = $1 
//     `;
//     const checkValues = [email];
//     const checkResult = await client.query(checkQuery, checkValues);

//     if (checkResult.rows.length === 0) {
//       // No user found
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const user = checkResult.rows[0];
//     console.log(`User logged in with ID: ${user.id}`);

//     // Send a response with the userId, email, and firebase_uid
//     return res.status(200).json({
//       message: 'Login successful',
//       userId: user.id,
//       email: user.email,
//       name: user.name,
//       firebase_uid: user.firebase_uid
//     });

//   } catch (err) {
//     console.error('Error during database query:', err);
//     return res.status(500).json({ message: 'Error during login' });
//   }
// });

// // Export the router to be used in the main app
// module.exports = router;

const express = require('express');
const client = require('../db'); // Assuming client is your PostgreSQL client
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Connect to PostgreSQL
client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Connection error', err.stack));

// Login user endpoint
router.post('/authlogin', async (req, res) => {
  const { email } = req.body; // Only require email, no firebase_uid

  if (!email) {
    return res.status(400).json({ message: 'Email is required' }); // Only check email
  }

  try {
    // Check if the user exists with the email
    const checkQuery = `
      SELECT id, email, name, firebase_uid
      FROM users
      WHERE email = $1 
    `;
    const checkValues = [email];
    const checkResult = await client.query(checkQuery, checkValues);

    if (checkResult.rows.length === 0) {
      // No user found
      return res.status(404).json({ message: 'User not found' });
    }

    const user = checkResult.rows[0];
    console.log(`User logged in with ID: ${user.id}`);

    // Send a response with the userId, email, and firebase_uid
    return res.status(200).json({
      message: 'Login successful',
      userId: user.id,
      email: user.email,
      name: user.name,
      firebase_uid: user.firebase_uid
    });

  } catch (err) {
    console.error('Error during database query:', err);
    return res.status(500).json({ message: 'Error during login' });
  }
});

// Export the router to be used in the main app
module.exports = router;
