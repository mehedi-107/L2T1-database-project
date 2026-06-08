const express = require('express');
const pool = require('../db/pool');

const router = express.Router();

router.get('/displayLeaveApplications', async (req, res) => {
  try {
    const leaveApplications = await pool.query(`
    SELECT *
    FROM "LEAVE_REQUESTS" 
    WHERE "APPROVAL" = 'Pending';
    `);
    res.json(leaveApplications.rows); 
  }
  
  catch (error) {
    console.error('Error fetching leave applications:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/applicantInfo/:applicantId', async (req, res) => {  
  try {
    const { applicantId } = req.params;
    if(Math.floor(applicantId/10000)==1){
      const query = `
      SELECT
      "DOCTOR_ID" AS "STAFF_ID",
      "FIRST_NAME",
      "LAST_NAME",
      "EMAIL",
      "CONTACT_NO",
      "SPECIALIZATION" AS "DEPARTMENT"
      FROM "DOCTORS"
      WHERE "DOCTOR_ID" = $1;
      `;
      const { rows } = await pool.query(query, [applicantId]);
      res.json(rows[0]);
    }
    else if(Math.floor(applicantId/10000)==3){
      const query = `
      SELECT
      "NURSE_ID" AS "STAFF_ID",
      "FIRST_NAME",
      "LAST_NAME",
      "EMAIL_ID" AS "EMAIL",
      "CONTACT_NO",
      "DEPT_ID" AS "DEPARTMENT"
      FROM "NURSES"
      WHERE "NURSE_ID" = $1;
      `;
      const { rows } = await pool.query(query, [applicantId]);
      res.json(rows[0]);
    }
    else{
      res.status(404).json({ error: 'Staff information not found' });
    }
  } catch (error) {
    console.error('Error fetching applicant information:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/leaveApplication', async (req, res) => {
  const { staffId, startDate, endDate, reason } = req.body;

  try {
    const insertQuery = `
      INSERT INTO "LEAVE_REQUESTS" ("APPLICANT_ID", "REASON_FOR_LEAVE", "START_DATE", "END_DATE")
      VALUES ($1, $2, $3, $4)
    `;
    await pool.query(insertQuery, [staffId, reason, startDate, endDate]);
    res.status(200).send('Leave application submitted successfully');
  } catch (error) {
    console.error('Error submitting leave application:', error);
    res.status(500).send('An error occurred while processing the request');
  }
});

router.post('/manageDoctorLeave/:doctorId', async (req, res) => {
  const { doctorId } = req.params;
  try {
    
    const result = await pool.query('SELECT * FROM manage_doctor_leave($1)', [doctorId]);
    
    const message = result.rows[0];
    res.send(message);
  } catch (error) {
    console.error('Error executing manage_doctor_leave:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/manageNurseLeave/:nurseId', async (req, res) => {
  const { nurseId } = req.params;
  try {
    
    const result = await pool.query('SELECT * FROM manage_nurse_leave($1)', [nurseId]);
   
    const message = result.rows[0];
    res.send(message);
  } catch (error) {
    console.error('Error executing manage_nurse_leave:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/rejectApplication/:leaveId', async (req, res) => {

  const { leaveId } = req.params;
  try {
    
    const result = await pool.query(`
      UPDATE "LEAVE_REQUESTS" SET "APPROVAL" = 'Rejected' WHERE "APPLICANT_ID" = $1;
    `
    , [leaveId]);
    
    const message = result.rows[0];
    res.send(message);
  } catch (error) {
    console.error('Error rejecting leave application:', error);
    res.status(500).send('An error occurred while rejecting the leave application');
  } 
});

router.post('/rejection/:leaveId', async (req, res) => {
  const { leaveId } = req.params;
  try {
    
    const result = await pool.query('SELECT * FROM reject_leave($1)', [leaveId]);
    
    const message = result.rows[0];
    res.send(message);
  } catch (error) {
    console.error('Error rejecting leave application:', error);
    res.status(500).send('An error occurred while rejecting the leave application');
  }
});

module.exports = router;
