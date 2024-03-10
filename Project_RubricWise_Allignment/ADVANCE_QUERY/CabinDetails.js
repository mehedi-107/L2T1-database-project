app.get('/cabinDetails/:cabinId', async (req, res) => {
    const { cabinId } = req.params;
    console.log(cabinId);
    try {
      floorNo = Math.floor(cabinId / 100);
      
      cabinNo = cabinId % 100;
      console.log(floorNo, cabinNo);
      // Query the database to fetch cabin details by cabin ID
      const cabinDetails = await pool.query(`
      SELECT
        W."CABIN_NO" AS "CABIN_NO",
        W."FLOOR_NO" AS "FLOOR_NO",
        W."ADMISSION_REASON" AS "REASON",
        W."PATIENT_ID" AS "PATIENT_ID",
        W."DOCTOR_ID_DAY" AS "DOCTOR_ID_DAY",
        W."DOCTOR_ID_NIGHT" AS "DOCTOR_ID_NIGHT",
        W."CABIN_TYPE" AS "CABIN_TYPE",
        W."NURSE_ID_1" AS "NURSE_ID_1",
        W."NURSE_ID_2" AS "NURSE_ID_2",
        D1."FIRST_NAME" AS "DAY_DOCTOR_FIRST_NAME",
        D1."LAST_NAME" AS "DAY_DOCTOR_LAST_NAME",
        D1."DEPT_ID" AS "DAY_DOCTOR_DEPT_ID",
        D1."EMAIL" AS "DAY_DOCTOR_EMAIL",
        D1."CONTACT_NO" AS "DAY_DOCTOR_CONTACT_NO",
        D2."FIRST_NAME" AS "NIGHT_DOCTOR_FIRST_NAME",
        D2."LAST_NAME" AS "NIGHT_DOCTOR_LAST_NAME",
        D2."DEPT_ID" AS "NIGHT_DOCTOR_DEPT_ID",
        D2."EMAIL" AS "NIGHT_DOCTOR_EMAIL",
        D2."CONTACT_NO" AS "NIGHT_DOCTOR_CONTACT_NO",
        P."FIRST_NAME" AS "PATIENT_FIRST_NAME",
        P."LAST_NAME" AS "PATIENT_LAST_NAME",
        P."GENDER" AS "PATIENT_GENDER",
        P."EMAIL_ID" AS "PATIENT_EMAIL_ID",
        P."CONTACT_NO" AS "PATIENT_CONTACT_NO",
        N1."FIRST_NAME" AS "NURSE_1_FIRST_NAME",
        N1."LAST_NAME" AS "NURSE_1_LAST_NAME",
        N1."EMAIL_ID" AS "NURSE_1_EMAIL_ID",
        N1."CONTACT_NO" AS "NURSE_1_CONTACT_NO",
        N1."SHIFT" AS "NURSE_1_SHIFT",
        N1."DEPT_ID" AS "NURSE_1_DEPT_ID",
        N2."FIRST_NAME" AS "NURSE_2_FIRST_NAME",
        N2."LAST_NAME" AS "NURSE_2_LAST_NAME",
        N2."EMAIL_ID" AS "NURSE_2_EMAIL_ID",
        N2."CONTACT_NO" AS "NURSE_2_CONTACT_NO",
        N2."SHIFT" AS "NURSE_2_SHIFT",
        N2."DEPT_ID" AS "NURSE_2_DEPT_ID"
    FROM
        "CABIN" AS W
    LEFT JOIN
        "DOCTORS" AS D1 ON W."DOCTOR_ID_DAY" = D1."DOCTOR_ID"
    LEFT JOIN
        "DOCTORS" AS D2 ON W."DOCTOR_ID_NIGHT" = D2."DOCTOR_ID"
    LEFT JOIN
        "PATIENTS" AS P ON W."PATIENT_ID" = P."PATIENT_ID"
    LEFT JOIN
        "NURSES" AS N1 ON W."NURSE_ID_1" = N1."NURSE_ID"
    LEFT JOIN
        "NURSES" AS N2 ON W."NURSE_ID_2" = N2."NURSE_ID"
    WHERE
        W."CABIN_NO" = $1 AND W."FLOOR_NO" = $2;
    ` , [cabinNo, floorNo]); 
      console.log(cabinDetails);
      if (cabinDetails.rows.length === 0) {
        return res.status(404).json({ message: 'Cabin not found' });
      }
  
      // Return cabin details as JSON response
      res.json(cabinDetails.rows[0]);
     // console.log(cabinDetails.rows[0]);
    } catch (error) {
      console.error('Error fetching cabin details:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });