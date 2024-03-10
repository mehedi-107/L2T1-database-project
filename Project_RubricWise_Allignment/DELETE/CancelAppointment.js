// there is a cascade delete on the appointment table, so the appointment will be deleted from the billing table as well

app.post('/cancelAppointment/:appointmentId', async (req, res) => {
    const { appointmentId } = req.params;
    console.log(appointmentId);
    try {
      // Execute a SQL query to cancel the appointment
      const result = await pool.query('DELETE FROM "APPOINTMENT" WHERE "APPOINTMENT_ID" = $1', [appointmentId]);
      // Check if any rows were affected
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

  