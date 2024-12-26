const express = require('express');
const client = require('./db');  
const router = express.Router();


router.post('/details', async (req, res) => {
  const { email, name, gender, dob, weight, height } = req.body;

  if (!email || !name || !gender || !dob || !weight || !height) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await client.query(
      `UPDATE details
       SET name = $1, gender = $2, date_of_birth = $3, weight = $4, height = $5
       WHERE email = $6`,
      [name, gender, dob, weight, height, email]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Details updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error', details: err.message });
    
  }
});

module.exports = router;

