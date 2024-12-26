// const express = require('express');
// const bodyParser = require('body-parser');
// const client = require('./db'); 
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Database connection configuration

// client.connect();

// // Middleware
// app.use(bodyParser.json());

// // API endpoint to update user role
// app.post('/updateRole', async (req, res) => {
//   const { email, role } = req.body;

//   if (!email || !role) {
//     return res.status(400).send({ message: 'Email and role are required' });
//   }

//   // Ensure role is either 'athlete' or 'trainer'
//   if (role !== 'athlete' && role !== 'trainer') {
//     return res.status(400).send({ message: 'Invalid role' });
//   }

//   try {
//     const result = await client.query(
//       'UPDATE details SET role = $1 WHERE email = $2 RETURNING *',
//       [role, email]
//     );

//     if (result.rows.length > 0) {
//       res.status(200).send({ message: 'Role updated successfully' });
//     } else {
//       res.status(404).send({ message: 'User not found' });
//     }
//   } catch (err) {
//     console.error('Error updating role:', err);
//     res.status(500).send({ message: 'Internal Server Error' });
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


const express = require('express');
// const bodyParser = require('body-parser');
const client = require('./db');  // Import the database client from db.js
const app = express();
const PORT = process.env.PORT || 3000;
const router = express.Router();

// Middleware
// app.use(bodyParser.json());

// API endpoint to insert user role
router.post('/role', async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).send({ message: 'Email and role are required' });
  }

  // Ensure role is either 'athlete' or 'trainer'
  if (role !== 'athlete' && role !== 'trainer') {
    return res.status(400).send({ message: 'Invalid role' });
  }

  try {
    // Directly insert the role into the database
    const insertRole = await client.query(
      'INSERT INTO details (email, role) VALUES ($1, $2) RETURNING *',
      [email, role]
    );

    res.status(201).send({ message: 'Role inserted successfully', user: insertRole.rows[0] });
  } catch (err) {
    console.error('Error inserting role:', err); // Log error details
    res.status(500).send({ message: 'Internal Server Error', details: err.message });
  }
});

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });  

module.exports = router;