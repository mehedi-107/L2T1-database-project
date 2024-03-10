app.post("/patientWardCheckOut", async (req, res) => {
    try {
      const { patientId } = req.body;
      console.log("hgcf",patientId);
      // Find the specific bed where the patient is located
      const wardInfo = await pool.query(
        `SELECT * FROM "WARD" WHERE $1 IN ("BED_1", "BED_2", "BED_3", "BED_4", "BED_5", "BED_6", "BED_7", "BED_8", "BED_9", "BED_10")`,
        [patientId]
      );
  
      if (wardInfo.rows.length === 0) {
        return res.status(404).json({ success: false, message: "Patient not found in any ward." });
      }
      
      const ward = wardInfo.rows[0];
      console.log(ward);
      let bedNumber;
      
      // Determine which bed the patient is in
      if (ward.BED_1 == patientId) {
        bedNumber = "BED_1";
      } else if (ward.BED_2 == patientId) {
        bedNumber = "BED_2";
      }
      else if (ward.BED_3 == patientId) {
        bedNumber = "BED_3";
      }
      else if (ward.BED_4 == patientId) {
        bedNumber = "BED_4";
      }
      else if (ward.BED_5 == patientId) {
        bedNumber = "BED_5";
      }
      else if (ward.BED_6 == patientId) {
        bedNumber = "BED_6";
      }
      else if (ward.BED_7 == patientId) {
        bedNumber = "BED_7";
      }
      else if (ward.BED_8 == patientId) {
        bedNumber = "BED_8";
      }
      else if (ward.BED_9 == patientId) {
        bedNumber = "BED_9";
      }
      else if (ward.BED_10 == patientId) {
        bedNumber = "BED_10";
      }
  
      console.log(bedNumber);
      // Add conditions for BED_3 to BED_10 as needed
  
      // Insert the ward information into the ward history table
      await pool.query(
        `INSERT INTO "WARD_HISTORY" ("DATE", "WARD_NO", "FLOOR_NO", "DOCTOR_ID_DAY", "DOCTOR_ID_NIGHT", "BED_1", "BED_2", "BED_3", "BED_4", "BED_5", "BED_6", "BED_7", "BED_8", "BED_9", "BED_10", "NURSE_ID_1", "NURSE_ID_2", "NURSE_ID_3", "NURSE_ID_4", "WARD_BOY_ID_1", "WARD_BOY_ID_2", "WARD_BOY_ID_3", "WARD_BOY_ID_4", "WARD_BOY_ID_5") 
        VALUES (CURRENT_DATE, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)`,
        [ward["WARD_NO"], ward["FLOOR_NO"], ward["DOCTOR_ID_DAY"], ward["DOCTOR_ID_NIGHT"], ward["BED_1"], ward["BED_2"], ward["BED_3"], ward["BED_4"], ward["BED_5"], ward["BED_6"], ward["BED_7"], ward["BED_8"], ward["BED_9"], ward["BED_10"], ward["NURSE_ID_1"], ward["NURSE_ID_2"], ward["NURSE_ID_3"], ward["NURSE_ID_4"], ward["WARD_BOY_ID_1"], ward["WARD_BOY_ID_2"], ward["WARD_BOY_ID_3"], ward["WARD_BOY_ID_4"], ward["WARD_BOY_ID_5"]]
      );
  
      // Update the specific bed in the ward to set patient ID to NULL
      await pool.query(
        `UPDATE "WARD" SET "${bedNumber.toUpperCase()}" = NULL WHERE "WARD_NO" = $1 AND "FLOOR_NO" = $2`,
        [ward["WARD_NO"], ward["FLOOR_NO"]]
      );
      console.log("Patient checked out of the ward successfully.");
      return res.status(200).json({ success: true, message: "Patient checked out of the ward successfully." });
    } catch (error) {
      console.error("Error checking out patient from ward:", error.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });