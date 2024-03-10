app.post('/submitAppointment', async (req, res) => {
    try {
      const { doctor, time, date, patientId } = req.body;
  
      console.log('Received appointment data:', req.body);
      
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