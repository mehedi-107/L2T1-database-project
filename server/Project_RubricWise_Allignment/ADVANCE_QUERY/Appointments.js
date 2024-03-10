app.get("/appointments", async (req, res) => {
    if(req.query.patientId){
      try {
        const { patientId } = req.query;
        console.log("Patient",patientId);
        const currentDate = new Date().toISOString().split('T')[0]; // Get current date in 'YYYY-MM-DD' format
        const appointments = await pool.query(
          'SELECT  A."REASON",A."APPOINTMENT_ID", A."APPOINTMENT_DATE", A."START_TIME", (A."START_TIME" + INTERVAL \'15 minutes\') AS END_TIME, D."DOCTOR_ID", D."FIRST_NAME", D."LAST_NAME", D."EMAIL", D."CONTACT_NO" FROM "APPOINTMENT" A JOIN "DOCTORS" D ON A."DOCTOR_ID" = D."DOCTOR_ID" WHERE A."PATIENT_ID" = $1 AND "APPOINTMENT_DATE" >= $2',
          [patientId, currentDate]
        );
        
        res.json(appointments.rows);
        console.log(appointments.rows);
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
      //console.log(appointments.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  
  });