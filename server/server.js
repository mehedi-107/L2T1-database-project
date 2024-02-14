const express = require('express');
const pool = require('./db2');

const app = express();

// Define a route to query the PostgreSQL database
app.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM "PATIENTS"');
    res.json(rows);
  } catch (error) {
    console.error('Error querying database:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
