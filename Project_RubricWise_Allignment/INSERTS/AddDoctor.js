app.post("/addDoctor", async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        dateOfBirth,
        departmentId,
        email,
        contactNumber,
        salary,
        gender,
        password,
        shift,
        experience,
        specialization,
        appointmentFee
      } = req.body;
      console.log(req.body);
        let maxId = await pool.query('SELECT MAX("DOCTOR_ID") as max FROM "DOCTORS"');
        console.log(maxId.rows[0].max); 
       
      const newDoctor = await pool.query(
        `INSERT INTO "DOCTORS" (
          "DOCTOR_ID",
          "FIRST_NAME",
          "LAST_NAME",
          "DATE_OF_BIRTH",
          "DEPT_ID",
          "EMAIL",
          "CONTACT_NO",
          "SALARY",
          "GENDER", 
          "PASSWORD",
          "SHIFT",
          "EXPERIENCE",
          "SPECIALIZATION",
          "APPOINTMENT_FEE"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [maxId.rows[0].max+1, firstName, lastName, dateOfBirth, departmentId, email, contactNumber
          , salary,gender, password, shift, experience, specialization, appointmentFee]
      ); 
  
      console.log("Doctor added successfully:", newDoctor.rows[0]);
      return res.status(201).json({ success: true, message: "Doctor added successfully", doctor: newDoctor.rows[0] });
    } catch (error) {
      console.error("Error adding doctor:", error.message);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  });