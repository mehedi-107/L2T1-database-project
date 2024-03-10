app.get('/cabinInfoforPatient/:patientId', async (req, res) => {
    const { patientId } = req.params;
    console.log("sldj",patientId);
    try {
      const cabinInfoQuery = `
      SELECT
      C."CABIN_NO",
      C."CABIN_TYPE",
      C."FLOOR_NO",
      C."PATIENT_ID",
      CONCAT(D_DAY."FIRST_NAME", ' ', D_DAY."LAST_NAME") AS "DOCTOR_NAME_DAY",
      D_DAY."EMAIL" AS "DOCTOR_EMAIL_DAY",
      D_DAY."CONTACT_NO" AS "DOCTOR_CONTACT_NO_DAY",
      CONCAT(D_NIGHT."FIRST_NAME", ' ', D_NIGHT."LAST_NAME") AS "DOCTOR_NAME_NIGHT",
      D_NIGHT."EMAIL" AS "DOCTOR_EMAIL_NIGHT",
      D_NIGHT."CONTACT_NO" AS "DOCTOR_CONTACT_NO_NIGHT",
      (
          CASE
              WHEN C."NURSE_ID_1" IS NOT NULL THEN CONCAT(N1."FIRST_NAME", ' ', N1."LAST_NAME")
              ELSE NULL
          END
      ) AS "NURSE_1_NAME",
      N1."EMAIL_ID" AS "NURSE_1_EMAIL",
      N1."CONTACT_NO" AS "NURSE_1_CONTACT_NO",
      (
          CASE
              WHEN C."NURSE_ID_2" IS NOT NULL THEN CONCAT(N2."FIRST_NAME", ' ', N2."LAST_NAME")
              ELSE NULL
          END
      ) AS "NURSE_2_NAME",
      N2."EMAIL_ID" AS "NURSE_2_EMAIL",
      N2."CONTACT_NO" AS "NURSE_2_CONTACT_NO",
      
      (
          CASE
              WHEN C."PATIENT_ID" IS NOT NULL THEN 
                  CASE 
                      WHEN C."ADMISSION_REASON" IS NOT NULL THEN C."ADMISSION_REASON"
                      ELSE 'Unknown'
                  END
              ELSE NULL
          END
      ) AS "ADMISSION_REASON"
  FROM
      "CABIN" C
      LEFT JOIN "DOCTORS" D_DAY ON C."DOCTOR_ID_DAY" = D_DAY."DOCTOR_ID"
      LEFT JOIN "DOCTORS" D_NIGHT ON C."DOCTOR_ID_NIGHT" = D_NIGHT."DOCTOR_ID"
      LEFT JOIN "NURSES" N1 ON C."NURSE_ID_1" = N1."NURSE_ID"
      LEFT JOIN "NURSES" N2 ON C."NURSE_ID_2" = N2."NURSE_ID"
  WHERE
      C."PATIENT_ID" = $1;
  
      `;
      
      const cabinInfoResult = await pool.query(cabinInfoQuery, [patientId]);
  
      const cabinInfo = cabinInfoResult.rows[0];
  
      if (!cabinInfo) {
        return res.status(404).json({ error: 'Cabin not found for the given patient' });
      }
  
      res.status(200).json(cabinInfo);
    } catch (err) {
      console.error('Error fetching cabin information:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });