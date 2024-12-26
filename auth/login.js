const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('../db');  // Import the database client from db.js
const dotenv = require('dotenv');
dotenv.config();  // Load environment variables

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';  // Use the environment variable for the secret key

// Middleware to parse JSON
router.use(express.json());

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if the email and password are provided
  if (!email || !password) {
    return res.status(400).send({ message: 'Email and password are required' });
  }

  try {
    // Check if the email exists in the database
    const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length === 0) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }

    const user = existingUser.rows[0];

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }

    // Create a JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Respond with the success message and the token
    res.status(200).send({
      message: 'Login successful',
      token: token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send({ message: 'Internal Server Error', details: error.message });
  }
});


module.exports = router;
