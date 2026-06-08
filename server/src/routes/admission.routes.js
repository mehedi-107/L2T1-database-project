const express = require('express');
const pool = require('../db/pool');

const router = express.Router();

router.post('/admitPatient/:patient_id/:required_specialization', async (req, res) => {
  try {
    const { patient_id, required_specialization } = req.params;
   
    let message = '';
    
    await pool.query('SELECT admit_patient_to_ward($1, $2) AS message', [patient_id, required_specialization], (err, result) => {
      if (err) {
        
        res.status(500).send('Internal Server Error');
      } else {
        const { message } = result.rows[0];
        res.send(message);
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/admitPatientToCabin/:patient_id/:cabinType', async (req, res) => {
  try {
    const { patient_id, cabinType } = req.params;
    
    const { rows } = await pool.query('SELECT admit_patient_to_cabin($1, $2) AS message', [patient_id, cabinType]);
    const message = rows[0].message;
    
    
    
   
    res.send(message);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/checkout/:cabinId', async (req, res) => {
  const { cabinId } = req.params;
  let cabinNo = cabinId % 100;
  let floorNo = Math.floor(cabinId / 100);
  try {
    
    const result = await pool.query(`
      UPDATE "CABIN" SET "PATIENT_ID" = NULL WHERE "CABIN_NO" = $1 AND "FLOOR_NO" = $2;
    `
    , [cabinNo, floorNo]);
   
    const message = result.rows[0];
    res.send(message);
  } catch (error) {
    console.error('Error checking out patient:', error);
    res.status(500).send('An error occurred while checking out the patient');
  }
});

module.exports = router;
