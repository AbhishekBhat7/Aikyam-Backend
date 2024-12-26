// const express = require('express');
// const client = require('../db');  // Import the database client from db.js
// const dotenv = require('dotenv');
// dotenv.config(); 
// const bodyParser = require('body-parser');


// app.use(bodyParser.json());

// // Endpoint to store user data
// app.post('/authregister', async (req, res) => {
//   const { email, name, firebase_uid } = req.body;

//   try {
//     const query = `
//       INSERT INTO users (email, name, firebase_uid)
//       VALUES ($1, $2, $3)
//       RETURNING id
//     `;
//     const values = [email, name, firebase_uid];

//     const result = await client.query(query, values);

//     if (result.rowCount > 0) {
//       res.status(200).json({ message: 'User added successfully!' });
//     } else {
//       res.status(400).json({ message: 'Failed to add user' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


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

// // Register user endpoint
// router.post('/authregister', async (req, res) => {
//   const { email, name, firebase_uid } = req.body;

//   if (!email || !name || !firebase_uid) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   try {
//     const query = `
//       INSERT INTO users (email, name, firebase_uid)
//       VALUES ($1, $2, $3)
//       RETURNING id
//     `;
//     const values = [email, name, firebase_uid];

//     const result = await client.query(query, values);

//     if (result.rows.length > 0) {
//       const userId = result.rows[0].id;
//       console.log(`User registered with ID: ${userId}`);
//       return res.status(201).json({ message: 'User registered successfully', userId });
//     } else {
//       return res.status(500).json({ message: 'Failed to register user' });
//     }
//   } catch (err) {
//     console.error('Error during database query:', err);
//     return res.status(500).json({ message: 'Error saving user data' });
//   }
// });

// module.exports = router;

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

// // Register user endpoint
// router.post('/authregister', async (req, res) => {
//   const { email, name, firebase_uid } = req.body;

//   if (!email || !name || !firebase_uid) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   try {
//     // First, check if the user already exists based on email or firebase_uid
//     const checkQuery = `
//       SELECT id FROM users
//       WHERE email = $1 OR firebase_uid = $2
//     `;
//     const checkValues = [email, firebase_uid];
//     const checkResult = await client.query(checkQuery, checkValues);

//     if (checkResult.rows.length > 0) {
//       // User already exists
//       return res.status(409).json({ message: 'User already exists with this email or firebase_uid' });
//     }

//     // If the user doesn't exist, proceed to insert the new user
//     const query = `
//       INSERT INTO users (email, name, firebase_uid)
//       VALUES ($1, $2, $3)
//       RETURNING id
//     `;
//     const values = [email, name, firebase_uid];

//     const result = await client.query(query, values);

//     if (result.rows.length > 0) {
//       const userId = result.rows[0].id;
//       console.log(`User registered with ID: ${userId}`);
//       return res.status(201).json({ message: 'User registered successfully', userId });
//     } else {
//       return res.status(500).json({ message: 'Failed to register user' });
//     }
//   } catch (err) {
//     console.error('Error during database query:', err);
//     return res.status(500).json({ message: 'Error saving user data' });
//   }
// });

// module.exports = router;


const express = require('express');
const client = require('../db');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Connection error', err.stack));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Register user endpoint
router.post('/authregister', async (req, res) => {
  const { email, name, firebase_uid } = req.body;

  if (!email || !name || !firebase_uid) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // First, check if the user already exists based on email or firebase_uid
    const checkQuery = `
      SELECT id FROM users
      WHERE email = $1 OR firebase_uid = $2
    `;
    const checkValues = [email, firebase_uid];
    const checkResult = await client.query(checkQuery, checkValues);

    if (checkResult.rows.length > 0) {
      // User already exists
      return res.status(409).json({ message: 'User already exists with this email or firebase_uid' });
    }

    // If the user doesn't exist, proceed to insert the new user
    const query = `
      INSERT INTO users (email, name, firebase_uid)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
    const values = [email, name, firebase_uid];

    const result = await client.query(query, values);

    if (result.rows.length > 0) {
      const userId = result.rows[0].id;
      console.log(`User registered with ID: ${userId}`);

      // Send a response with the userId, email, and firebase_uid
      return res.status(201).json({
        message: 'User registered successfully',
        userId,
        email,
        firebase_uid
      });
    } else {
      return res.status(500).json({ message: 'Failed to register user' });
    }
  } catch (err) {
    console.error('Error during database query:', err);
    return res.status(500).json({ message: 'Error saving user data' });
  }
});

module.exports = router;

