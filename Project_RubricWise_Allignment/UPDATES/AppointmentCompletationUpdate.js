app.post('/markCompleted', async (req, res) => {
    try {
      const { appointmentId, result } = req.body;
  
      //console.log('Received appointment ID:', appointmentId);
      //console.log('Received result:', result);
  
     
      await pool.query('UPDATE "MEDICAL_RECORD_PATIENT" SET "RESULT" = $2, "SERVICE_DATE" = CURRENT_DATE WHERE "APPOINTMENT_ID" = $1', [appointmentId, result]);
      res.json({ success: true });
    } catch (error) {
      console.error('Error marking appointment as completed:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });