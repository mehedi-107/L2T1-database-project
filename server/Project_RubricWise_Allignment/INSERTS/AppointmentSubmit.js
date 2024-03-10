app.post('/submitAppointment', async (req, res) => {
    try {
      const { doctor, time, date, patientId } = req.body;
  
      console.log('Received appointment data:', req.body);
      // Step 1: Select the highest appointment ID
      const selectMaxAppointmentIdQueryFromMedicalRecord = `
        SELECT MAX("APPOINTMENT_ID") as max_id FROM "MEDICAL_RECORD_PATIENT";
      `;
  
      const maxIdResultFromMedicalRecord = await pool.query(selectMaxAppointmentIdQueryFromMedicalRecord);
  
      //console.log(maxIdResultFromMedicalRecord.rows[0].max_id);
      const nextAppointmentId = maxIdResultFromMedicalRecord.rows[0].max_id + 1;
  
      // Step 2: Insert the new appointment with the calculated ID
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