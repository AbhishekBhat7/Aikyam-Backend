const { pool } = require('pg');
require('dotenv').config();  // To load environment variables

const pool = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, // Avoid SSL validation issues with Azure
},
});

pool.connect()
  .then(() => {
    console.log("Connected to PostgreSQL database.");
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL database", err.stack);
  });

module.exports = pool;