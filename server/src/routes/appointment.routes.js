const express = require('express');
const { addMinutes, format } = require('date-fns');
const pool = require('../db/pool');

const router = express.Router();

router.get('/availableTimeSlots', async (req, res) => {
  try {
    const { doctor, date } = req.query;
    let startTime = '08:00:00';
    let endTime = '12:00:00';
    if (doctor > 10100) {
      startTime = '18:00:00';
      endTime = '22:00:00';
    }
    const query = `
      SELECT "START_TIME" 
      FROM "APPOINTMENT"
      WHERE "DOCTOR_ID" = $1 
      AND "APPOINTMENT_DATE" = $2
      ORDER BY "START_TIME";
    `;

    const result = await pool.query(query, [doctor, date]);

    const occupiedTimeSlots = new Set(result.rows.map(row => row.START_TIME));
    const availableTimeSlots = [];
    let currentTime = new Date(`${date} ${startTime}`);

    while (currentTime < new Date(`${date} ${endTime}`)) {
      const timeSlot = format(currentTime, 'HH:mm:ss');

      if (!occupiedTimeSlots.has(timeSlot)) {
        const dateTimeSlot = {
          date,
          time: timeSlot,
        };

        availableTimeSlots.push(dateTimeSlot);
      }

      currentTime = addMinutes(currentTime, 15);
    }

    res.json(availableTimeSlots);
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/submitAppointment', async (req, res) => {
  try {
    const { doctor, time, date, patientId } = req.body;

    const selectMaxAppointmentIdQueryFromMedicalRecord = `
      SELECT MAX("APPOINTMENT_ID") as max_id FROM "MEDICAL_RECORD_PATIENT";
    `;

    const maxIdResultFromMedicalRecord = await pool.query(selectMaxAppointmentIdQueryFromMedicalRecord);

    const nextAppointmentId = maxIdResultFromMedicalRecord.rows[0].max_id + 1;

   
    const insertAppointmentQuery = `
      INSERT INTO "APPOINTMENT" ("APPOINTMENT_ID", "DOCTOR_ID", "APPOINTMENT_DATE", "START_TIME", "PATIENT_ID")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const result = await pool.query(insertAppointmentQuery, [nextAppointmentId, doctor, date, time, patientId]);
    
    res.json({ success: true, appointment: result.rows[0] });
  } catch (error) {
    console.error('Error submitting appointment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/cancelAppointment/:appointmentId', async (req, res) => {
  const { appointmentId } = req.params;
  try {
    
    const result = await pool.query('DELETE FROM "APPOINTMENT" WHERE "APPOINTMENT_ID" = $1', [appointmentId]);
   const re = await pool.query('UPDATE "MEDICAL_RECORD_PATIENT" SET "RESULT" = $2, "SERVICE_DATE" = CURRENT_DATE WHERE "APPOINTMENT_ID" = $1', [appointmentId, "Cancelled"]);
    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Appointment cancelled successfully' });
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'An error occurred while cancelling the appointment' });
  }
});

router.post('/markCompleted', async (req, res) => {
  try {
    const { appointmentId, result } = req.body;

    // Update the APPOINTMENT table to mark the appointment as completed

    // Update the MEDICAL_RECORD_PATIENT table with the result and current date
    await pool.query('UPDATE "MEDICAL_RECORD_PATIENT" SET "RESULT" = $2, "SERVICE_DATE" = CURRENT_DATE WHERE "APPOINTMENT_ID" = $1', [appointmentId, result]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking appointment as completed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get("/appointments", async (req, res) => {
  if(req.query.patientId){
    try {
      const { patientId } = req.query;
      const currentDate = new Date().toISOString().split('T')[0]; // Get current date in 'YYYY-MM-DD' format
      const appointments = await pool.query(
        'SELECT  A."REASON",A."APPOINTMENT_ID", A."APPOINTMENT_DATE", A."START_TIME", (A."START_TIME" + INTERVAL \'15 minutes\') AS END_TIME, D."DOCTOR_ID", D."FIRST_NAME", D."LAST_NAME", D."EMAIL", D."CONTACT_NO" FROM "APPOINTMENT" A JOIN "DOCTORS" D ON A."DOCTOR_ID" = D."DOCTOR_ID" WHERE A."PATIENT_ID" = $1 AND "APPOINTMENT_DATE" >= $2',
        [patientId, currentDate]
      );
      
      res.json(appointments.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
   else
  try {
    const { doctorId } = req.query;
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in 'YYYY-MM-DD' format
    const appointments = await pool.query(
      `
      SELECT P.*,A.*,B."AMOUNT_PAID",B."AMOUNT_DUE"
FROM "PATIENTS" P JOIN "APPOINTMENT" A ON P."PATIENT_ID"=A."PATIENT_ID" 
JOIN "BILLING" B ON B."APPOINTMENT_ID"=A."APPOINTMENT_ID"
WHERE A."DOCTOR_ID"=$1 AND "APPOINTMENT_DATE" > $2 
      `, 
      [doctorId, currentDate]);
    res.json(appointments.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }

});

module.exports = router;
