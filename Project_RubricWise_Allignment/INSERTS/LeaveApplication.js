app.post('/leaveApplication', async (req, res) => {
    const { staffId, startDate, endDate, reason } = req.body;
  
    try {
      // Insert leave application into the database
      const insertQuery = `
        INSERT INTO "LEAVE_REQUESTS" ("APPLICANT_ID", "REASON_FOR_LEAVE", "START_DATE", "END_DATE")
        VALUES ($1, $2, $3, $4)
      `;
      await pool.query(insertQuery, [staffId, reason, startDate, endDate]);
      console.log("Leave application submitted successfully");
      res.status(200).send('Leave application submitted successfully');
    } catch (error) {
      console.error('Error submitting leave application:', error);
      res.status(500).send('An error occurred while processing the request');
    }
  });