app.post('/markCompleted', async (req, res) => {
    try {
      const { appointmentId, result } = req.body;
  
      //console.log('Received appointment ID:', appointmentId);
      //console.log('Received result:', result);
  
      // Update the APPOINTMENT table to mark the appointment as completed
  
      // Update the MEDICAL_RECORD_PATIENT table with the result and current date
      await pool.query('UPDATE "MEDICAL_RECORD_PATIENT" SET "RESULT" = $2, "SERVICE_DATE" = CURRENT_DATE WHERE "APPOINTMENT_ID" = $1', [appointmentId, result]);
  
      // Here, you can handle saving the result to your database as well if needed.
      // For example, if you have a separate table to store appointment results, you can insert the result there.
  
      res.json({ success: true });
    } catch (error) {
      console.error('Error marking appointment as completed:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });