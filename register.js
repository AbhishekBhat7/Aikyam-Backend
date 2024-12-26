// const express = require('express');
// const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt');
// const client = require('./db'); // Import the client from db.js
// const app = express();

// app.use(bodyParser.json());

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

// // Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });




// const express = require('express');
// const bcrypt = require('bcrypt');
// const client = require('./db'); // Import the PostgreSQL client
// const router = express.Router();

// // Register endpoint to handle new user registration
// router.post('/register', async (req, res) => {
//   const { name, email, password } = req.body;

//   // Validate input
//   if (!name || !email || !password) {
//     return res.status(400).json({ status: 'error', message: 'Missing required fields' });
//   }

//   try {
//     // Check if user already exists in the database
//     const checkQuery = 'SELECT * FROM users WHERE email = $1';
//     const checkResult = await client.query(checkQuery, [email]);

//     if (checkResult.rows.length > 0) {
//       return res.status(400).json({ status: 'error', message: 'User already exists' });
//     }

//     // Hash the password before saving it
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Insert the new user into the database
//     const insertQuery = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';
//     const insertResult = await client.query(insertQuery, [name, email, hashedPassword]);

//     const newUser = insertResult.rows[0];

//     // Respond with the user ID
//     res.status(200).json({
//       status: 'success',
//       message: 'User registered successfully',
//       user_id: newUser.id,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: 'error', message: 'Internal Server Error' });
//   }
// });

// module.exports = router;


// const express = require('express');
// const client = require('./db'); // Import the PostgreSQL client
// const router = express.Router();

// // Register endpoint to handle new user registration
// router.post('/register', async (req, res) => {
//   const { name, email, password } = req.body;

//   // Validate input
//   if (!name || !email || !password) {
//     return res.status(400).json({ status: 'error', message: 'Missing required fields' });
//   }

//   try {
//     // Check if user already exists in the database
//     const checkQuery = 'SELECT * FROM users WHERE email = $1';
//     const checkResult = await client.query(checkQuery, [email]);

//     if (checkResult.rows.length > 0) {
//       return res.status(400).json({ status: 'error', message: 'User already exists' });
//     }

//     // Respond with the status
//     res.status(200).json({
//       status: 'success',
//       message: 'User is valid, please verify OTP',
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: 'error', message: 'Internal Server Error' });
//   }
// });

// module.exports = router;



// const express = require('express');
// const router = express.Router();
// const client = require('./db'); // Import the PostgreSQL client

// // Register endpoint to handle new user registration
// router.post('/register', async (req, res) => {
//     const { name, email, password } = req.body;

//     // Validate input
//     if (!name || !email || !password) {
//         return res.status(400).json({ status: 'error', message: 'Missing required fields' });
//     }

//     try {
//         // Check if user already exists in the database
//         const checkQuery = 'SELECT * FROM users WHERE email = $1';
//         const checkResult = await client.query(checkQuery, [email]);

//         if (checkResult.rows.length > 0) {
//             return res.status(400).json({ status: 'error', message: 'User already exists' });
//         }

//         // Respond with the status
//         res.status(200).json({
//             status: 'success',
//             message: 'User is valid, please verify OTP',
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: 'error', message: 'Internal Server Error' });
//     }
// });

// module.exports = router;




// // register.js
// const express = require('express');
// const router = express.Router();
// const client = require('./db'); // Import the PostgreSQL client
// const axios = require('axios');  // Import Axios to call the /sendOtp route

// // Register endpoint to handle new user registration
// router.post('/register', async (req, res) => {
//     const { name, email, password } = req.body;

//     // Validate input
//     if (!name || !email || !password) {
//         return res.status(400).json({ status: 'error', message: 'Missing required fields' });
//     }

//     try {
//         // Check if user already exists in the database
//         const checkQuery = 'SELECT * FROM users WHERE email = $1';
//         const checkResult = await client.query(checkQuery, [email]);

//         if (checkResult.rows.length > 0) {
//             return res.status(400).json({ status: 'error', message: 'User already exists' });
//         }

//         // Store user temporarily for OTP process
//         // Send the data to the /sendOtp endpoint
//         const otpResponse = await axios.post('http://localhost:3000/sendOtp', {
//             name,
//             email,
//             password
//         });

//         if (otpResponse.data.success) {
//             res.status(200).json({
//                 status: 'success',
//                 message: 'User is valid, OTP sent, please verify OTP'
//             });
//         } else {
//             res.status(500).json({ status: 'error', message: 'Failed to send OTP' });
//         }

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: 'error', message: 'Internal Server Error' });
//     }
// });

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const client = require('./db'); // Import the PostgreSQL client
// const axios = require('axios');  // Import Axios to call the /sendOtp route
// require('dotenv').config();  // Import dotenv to use environment variables

// // Register endpoint to handle new user registration
// router.post('/register', async (req, res) => {
//     const { name, email, password } = req.body;

//     // Validate input
//     if (!name || !email || !password) {
//         return res.status(400).json({ status: 'error', message: 'Missing required fields' });
//     }

//     try {
//         // Check if user already exists in the database
//         const checkQuery = 'SELECT * FROM users WHERE email = $1';
//         const checkResult = await client.query(checkQuery, [email]);

//         if (checkResult.rows.length > 0) {
//             return res.status(400).json({ status: 'error', message: 'User already exists' });
//         }

//         // Store user temporarily for OTP process
//         // Send the data to the /sendOtp endpoint
//         const otpServiceUrl = process.env.OTP_SERVICE_URL; // Use the environment variable

//         const otpResponse = await axios.post(otpServiceUrl, {
//             name,
//             email,
//             password
//         });

//         if (otpResponse.data.success) {
//             res.status(200).json({
//                 status: 'success',
//                 message: 'User is valid, OTP sent, please verify OTP'
//             });
//         } else {
//             res.status(500).json({ status: 'error', message: 'Failed to send OTP' });
//         }

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: 'error', message: 'Internal Server Error' });
//     }
// });

// module.exports = router;




// const express = require('express');
// const router = express.Router();
// const client = require('./db'); // Import the PostgreSQL client
// const axios = require('axios');  // Import Axios to call the /sendOtp route
// require('dotenv').config();  // Import dotenv to use environment variables

// // Register endpoint to handle new user registration
// router.post('/register', async (req, res) => {
//     const { name, email, password } = req.body;

//     // Validate input
//     if (!name || !email || !password) {
//         return res.status(400).json({ status: 'error', message: 'Missing required fields' });
//     }

//     try {
//         // Check if user already exists in the database
//         const checkQuery = 'SELECT * FROM users WHERE email = $1';
//         const checkResult = await client.query(checkQuery, [email]);

//         if (checkResult.rows.length > 0) {
//             return res.status(400).json({ status: 'error', message: 'User already exists' });
//         }

//         // Store user temporarily for OTP process
//         // Send the data to the /sendOtp endpoint
//         const otpServiceUrl = process.env.OTP_SERVICE_URL; // Use the environment variable

//         const otpResponse = await axios.post(otpServiceUrl, {
//             name,
//             email,
//             password
//         });

//         if (otpResponse.data.success) {
//             // Store the user in the database after successful OTP
//             // const insertQuery = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING email, name';
//             // const insertResult = await client.query(insertQuery, [name, email, password]);

//             // Return the user info along with success message
//             res.status(200).json({
//                 status: 'success',
//                 message: 'User registered successfully, OTP sent, please verify OTP',
//                 email: insertResult.rows[0].email,  // Include the email in the response
//                 name: insertResult.rows[0].name    // Include the name in the response
//             });
//         } else {
//             res.status(500).json({ status: 'error', message: 'Failed to send OTP' });
//         }

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: 'error', message: 'Internal Server Error' });
//     }
// });

// module.exports = router;





const express = require('express');
const router = express.Router();
const axios = require('axios');  // Import Axios to call the /sendOtp route
require('dotenv').config();  // Import dotenv to use environment variables
const client = require('./db')

// Register endpoint to handle new user registration
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ status: 'error', message: 'Missing required fields' });
    }

    try {
        // Log the incoming request data
        console.log('Registering user:', { name, email, password });
        const checkQuery = 'SELECT * FROM users WHERE email = $1';
        const checkResult = await client.query(checkQuery, [email]);
                if (checkResult.rows.length > 0)
                 {
                    return res.status(400).json({ status: 'error', message: 'User already exists' });
                }
        // Send the data to the /sendOtp endpoint (OTP service)
        const otpServiceUrl = process.env.OTP_SERVICE_URL; // Use the environment variable
        console.log('Sending request to OTP service:', otpServiceUrl);

        const otpResponse = await axios.post(otpServiceUrl, {
            name,
            email,
            password
        });

        // Log the response from OTP service
        console.log('OTP service response:', otpResponse.data);

        if (otpResponse.data.success) {
            // Send back the name and email (but do not store it in the database yet)
            res.status(200).json({
                status: 'success',
                message: 'User registered successfully, OTP sent, please verify OTP',
                email: email,  // Send the email in the response
                name: name     // Send the name in the response
            });
        } else {
            res.status(500).json({ status: 'error', message: 'Failed to send OTP' });
        }

    } catch (error) {
        // Log the error for debugging
        console.error('Error during registration:', error);

        // Check if error is from Axios
        if (error.response) {
            // Log Axios response error
            console.error('Axios response error:', error.response.data);
        } else if (error.request) {
            // Log if no response received
            console.error('No response received from OTP service:', error.request);
        } else {
            // Log any error while setting up the request
            console.error('Error setting up request:', error.message);
        }

        // Return a detailed error message
        res.status(500).json({ status: 'error', message: error.message || 'Internal Server Error' });
    }
});

module.exports = router;
