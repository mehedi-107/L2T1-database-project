const express = require('express');
const pool = require('../db/pool');

const router = express.Router();

router.post('/remove/:id', async (req, res) => {
  const employeeId = parseInt(req.params.id);
  try {
    if (Math.floor(employeeId / 10000) === 1) {
      
      await pool.query('DELETE FROM "DOCTORS" WHERE "DOCTOR_ID" = $1', [employeeId]);
      res.status(200).json({ message: 'Doctor removed successfully.' });
    } else if (Math.floor(employeeId/ 10000) === 3) {
      
      await pool.query('DELETE FROM "NURSES" WHERE "NURSE_ID" = $1', [employeeId]);
      res.status(200).json({ message: 'Nurse removed successfully.' });
    } else {
      res.status(400).json({ message: 'Invalid employee ID.' });
    }
  } catch (error) {
    console.error('Error removing employee:', error.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
