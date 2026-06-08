const express = require('express');
const pool = require('../db/pool');

const router = express.Router();

router.get('/departments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "DEPARTMENTS"');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/cabinTypes', async (req, res) => {  
  try {
    const cabinTypes = await pool.query('SELECT DISTINCT "CABIN_TYPE" FROM "CABIN"');
    res.json(cabinTypes.rows);
  } catch (error) {
    console.error('Error fetching cabin types:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
