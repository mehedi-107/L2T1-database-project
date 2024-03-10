app.post("/signup", async (req, res) => {
    try {
      const userData = req.body;
  
  
      console.log("Received signup data:", userData);
  
      const {
        FIRST_NAME,
        LAST_NAME,
        EMAIL,
        GENDER,
        DATE_OF_BIRTH,
        CONTACT_NO,
        PASSWORD,
      } = userData;
  
  
      const lastId = await pool.query('SELECT MAX("PATIENT_ID") FROM "PATIENTS"');
  
      const nextId = lastId.rows[0].max + 1;
      console.log("Next ID:", nextId);
  
  
      await pool.query(
        'INSERT INTO "PATIENTS" ("PATIENT_ID", "FIRST_NAME", "LAST_NAME", "EMAIL_ID", "GENDER", "DATE_OF_BIRTH", "CONTACT_NO", "PASSWORD") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [
          nextId,
          FIRST_NAME,
          LAST_NAME,
          EMAIL,
          GENDER,
          DATE_OF_BIRTH,
          CONTACT_NO,
          PASSWORD,
        ]
      );
      res.status(201).json({ success: true, message: "Signup successful" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });