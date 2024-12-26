// const express = require('express');
// const client = require('../db');  // Import the database client from db.js
// const app = express();
// const PORT = process.env.PORT || 3000;
// const router = express.Router();

// router.get('/details/:email', async (req, res) => {
//   const { email } = req.params;

//   if (!email) {
//     return res.status(400).send({ message: 'Email is required' });
//   }

//   try {
//     // Query to retrieve user details by email
//     const userDetails = await client.query(
//       'SELECT * FROM details WHERE email = $1',
//       [email]
//     );

//     // If no user is found
//     if (userDetails.rows.length === 0) {
//       return res.status(404).send({ message: 'User not found' });
//     }

//     // If user is found, return their details
//     res.status(200).send({ message: 'User details retrieved successfully', user: userDetails.rows[0] });
//   } catch (err) {
//     console.error('Error retrieving user details:', err);  // Log error details
//     res.status(500).send({ message: 'Internal Server Error', details: err.message });
//   }
// });

// module.exports = router;




const express = require('express');
const client = require('../db');  // Import the database client from db.js
const app = express();
const PORT = process.env.PORT || 3000;
const router = express.Router();

// Middleware to parse JSON requests
app.use(express.json());

// Get user details by email
router.get('/details/:email', async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).send({ message: 'Email is required' });
  }

  try {
    // Query to retrieve user details by email
    const userDetails = await client.query(
      'SELECT * FROM details WHERE email = $1',
      [email]
    );

    // If no user is found
    if (userDetails.rows.length === 0) {
      return res.status(404).send({ message: 'User not found' });
    }

    // If user is found, return their details
    res.status(200).send({ message: 'User details retrieved successfully', user: userDetails.rows[0] });
  } catch (err) {
    console.error('Error retrieving user details:', err);  // Log error details
    res.status(500).send({ message: 'Internal Server Error', details: err.message });
  }
});

// Update user details by email
router.put('/updateprofile/details/:email', async (req, res) => {
  const { email } = req.params;
  const { role, name, gender, date_of_birth, weight, height } = req.body;

  // Check that all the required fields are provided
  if (!email || !role || !name || !gender || !date_of_birth || !weight || !height) {
    return res.status(400).send({ message: 'Email, role, name, gender, date_of_birth, weight, and height are required to update user details' });
  }

  try {
    // Query to check if the user exists in the details table
    const userExists = await client.query(
      'SELECT * FROM details WHERE email = $1',
      [email]
    );

    if (userExists.rows.length === 0) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Update user details in the database
    const updateQuery = `
      UPDATE details
      SET role = $1, name = $2, gender = $3, date_of_birth = $4, weight = $5, height = $6
      WHERE email = $7
      RETURNING *;
    `;
    const updatedUser = await client.query(updateQuery, [role, name, gender, date_of_birth, weight, height, email]);

    // If update is successful, return updated details
    res.status(200).send({ message: 'User details updated successfully', user: updatedUser.rows[0] });
  } catch (err) {
    console.error('Error updating user details:', err);
    res.status(500).send({ message: 'Internal Server Error', details: err.message });
  }
});

module.exports = router;
