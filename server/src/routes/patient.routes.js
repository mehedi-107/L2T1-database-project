const express = require('express');
const pool = require('../db/pool');

const router = express.Router();

router.get("/lastUserID", async (req, res) => {
  try {
    const lastUserID = await pool.query('SELECT MAX("PATIENT_ID") FROM "PATIENTS"');
    res.json(lastUserID.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get('/allocatedCabins', async (req, res) => {
  try {
    const { patientId } = req.query;
    const query = `
      SELECT *
      FROM "CABIN"
      WHERE "PATIENT_ID" = $1;
    `;

    const result = await pool.query(query, [patientId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching allocated cabins:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/allocatedWards', async (req, res) => {
  const { patientId } = req.query;

  try {
    const result = await pool.query(
      'SELECT * FROM "WARD" WHERE $1 IN ( "BED_1", "BED_2", "BED_3", "BED_4", "BED_5", "BED_6", "BED_7", "BED_8", "BED_9", "BED_10" )',
      [patientId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const userData = req.body;

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

router.post("/patientCabinCheckOut", async (req, res) => {
  try {
    const { patientId } = req.body;

    const cabinInfo = await pool.query(
      `SELECT * FROM "CABIN" WHERE "PATIENT_ID" = $1`,
      [patientId]
    );

    if (cabinInfo.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Patient not found in any cabin." });
    }

    const cabin = cabinInfo.rows[0];

    await pool.query(
      `INSERT INTO "CABIN_HISTORY" ("DATE", "CABIN_NO", "FLOOR_NO", "PATIENT_ID", "DOCTOR_ID_DAY", "DOCTOR_ID_NIGHT", "CABIN_TYPE", "NURSE_ID_1", "NURSE_ID_2") 
      VALUES (CURRENT_DATE, $1, $2, $3, $4, $5, $6, $7, $8)`,
      [cabin["CABIN_NO"], cabin["FLOOR_NO"], cabin["PATIENT_ID"], cabin["DOCTOR_ID_DAY"], cabin["DOCTOR_ID_NIGHT"], cabin["CABIN_TYPE"], cabin["NURSE_ID_1"], cabin["NURSE_ID_2"]]
    );

    await pool.query(
      `UPDATE "CABIN" SET "PATIENT_ID" = NULL WHERE "PATIENT_ID" = $1`,
      [patientId]
    );
    return res.status(200).json({ success: true, message: "Patient checked out successfully." });
  } catch (error) {
    console.error("Error checking out patient from cabin:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/patientWardCheckOut", async (req, res) => {
  try {
    const { patientId } = req.body;
    const wardInfo = await pool.query(
      `SELECT * FROM "WARD" WHERE $1 IN ("BED_1", "BED_2", "BED_3", "BED_4", "BED_5", "BED_6", "BED_7", "BED_8", "BED_9", "BED_10")`,
      [patientId]
    );

    if (wardInfo.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Patient not found in any ward." });
    }
    
    const ward = wardInfo.rows[0];
    let bedNumber;

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

    await pool.query(
      `INSERT INTO "WARD_HISTORY" ("DATE", "WARD_NO", "FLOOR_NO", "DOCTOR_ID_DAY", "DOCTOR_ID_NIGHT", "BED_1", "BED_2", "BED_3", "BED_4", "BED_5", "BED_6", "BED_7", "BED_8", "BED_9", "BED_10", "NURSE_ID_1", "NURSE_ID_2", "NURSE_ID_3", "NURSE_ID_4", "WARD_BOY_ID_1", "WARD_BOY_ID_2", "WARD_BOY_ID_3", "WARD_BOY_ID_4", "WARD_BOY_ID_5") 
      VALUES (CURRENT_DATE, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)`,
      [ward["WARD_NO"], ward["FLOOR_NO"], ward["DOCTOR_ID_DAY"], ward["DOCTOR_ID_NIGHT"], ward["BED_1"], ward["BED_2"], ward["BED_3"], ward["BED_4"], ward["BED_5"], ward["BED_6"], ward["BED_7"], ward["BED_8"], ward["BED_9"], ward["BED_10"], ward["NURSE_ID_1"], ward["NURSE_ID_2"], ward["NURSE_ID_3"], ward["NURSE_ID_4"], ward["WARD_BOY_ID_1"], ward["WARD_BOY_ID_2"], ward["WARD_BOY_ID_3"], ward["WARD_BOY_ID_4"], ward["WARD_BOY_ID_5"]]
    );

    await pool.query(
      `UPDATE "WARD" SET "${bedNumber.toUpperCase()}" = NULL WHERE "WARD_NO" = $1 AND "FLOOR_NO" = $2`,
      [ward["WARD_NO"], ward["FLOOR_NO"]]
    );
    return res.status(200).json({ success: true, message: "Patient checked out of the ward successfully." });
  } catch (error) {
    console.error("Error checking out patient from ward:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get('/patientInfoforWard/:patientId', async (req, res) => {
  const { patientId } = req.params;
  try {
    
    const patientInfoQuery = `
    SELECT
    W."WARD_NO",
    W."FLOOR_NO",
    W."DOCTOR_ID_DAY",
    W."DOCTOR_ID_NIGHT",
    w."ADMISSION_REASON",
    P."PATIENT_ID",
    P."FIRST_NAME" AS "PATIENT_FIRST_NAME",
    P."LAST_NAME" AS "PATIENT_LAST_NAME",
    P."EMAIL_ID" AS "PATIENT_EMAIL",
    P."GENDER" AS "PATIENT_GENDER",
    P."DATE_OF_BIRTH" AS "PATIENT_DATE_OF_BIRTH",
    P."CONTACT_NO" AS "PATIENT_CONTACT_NO",
    CONCAT(D_DAY."FIRST_NAME", ' ', D_DAY."LAST_NAME") AS "DOCTOR_NAME_DAY",
    D_DAY."EMAIL" AS "DOCTOR_EMAIL_DAY",
    D_DAY."CONTACT_NO" AS "DOCTOR_CONTACT_NO_DAY",
    CONCAT(D_NIGHT."FIRST_NAME", ' ', D_NIGHT."LAST_NAME") AS "DOCTOR_NAME_NIGHT",
    D_NIGHT."EMAIL" AS "DOCTOR_EMAIL_NIGHT",
    D_NIGHT."CONTACT_NO" AS "DOCTOR_CONTACT_NO_NIGHT",
    (
        CASE
            WHEN W."NURSE_ID_1" IS NOT NULL THEN N1."FIRST_NAME" || ' ' || N1."LAST_NAME"
            ELSE NULL
        END
    ) AS "NURSE_1_NAME",
    N1."EMAIL_ID" AS "NURSE_1_EMAIL",
    N1."CONTACT_NO" AS "NURSE_1_CONTACT_NO",  -- Added nurse contact number
    W."NURSE_ID_1" AS "NURSE_1_ID",
    (
        CASE
            WHEN W."NURSE_ID_2" IS NOT NULL THEN N2."FIRST_NAME" || ' ' || N2."LAST_NAME"
            ELSE NULL
        END
    ) AS "NURSE_2_NAME",
    N2."EMAIL_ID" AS "NURSE_2_EMAIL",
    N2."CONTACT_NO" AS "NURSE_2_CONTACT_NO",  -- Added nurse contact number
    W."NURSE_ID_2" AS "NURSE_2_ID",
    (
        CASE
            WHEN W."NURSE_ID_3" IS NOT NULL THEN N3."FIRST_NAME" || ' ' || N3."LAST_NAME"
            ELSE NULL
        END
    ) AS "NURSE_3_NAME",
    N3."EMAIL_ID" AS "NURSE_3_EMAIL",
    N3."CONTACT_NO" AS "NURSE_3_CONTACT_NO",  -- Added nurse contact number
    W."NURSE_ID_3" AS "NURSE_3_ID",
    (
        CASE
            WHEN W."NURSE_ID_4" IS NOT NULL THEN N4."FIRST_NAME" || ' ' || N4."LAST_NAME"
            ELSE NULL
        END
    ) AS "NURSE_4_NAME",
    N4."EMAIL_ID" AS "NURSE_4_EMAIL",
    N4."CONTACT_NO" AS "NURSE_4_CONTACT_NO",  -- Added nurse contact number
    W."NURSE_ID_4" AS "NURSE_4_ID"
FROM
    "WARD" W
    LEFT JOIN "PATIENTS" P ON (
        W."BED_1" = P."PATIENT_ID" OR
        W."BED_2" = P."PATIENT_ID" OR
        W."BED_3" = P."PATIENT_ID" OR
        W."BED_4" = P."PATIENT_ID" OR
        W."BED_5" = P."PATIENT_ID" OR
        W."BED_6" = P."PATIENT_ID" OR
        W."BED_7" = P."PATIENT_ID" OR
        W."BED_8" = P."PATIENT_ID" OR
        W."BED_9" = P."PATIENT_ID" OR
        W."BED_10" = P."PATIENT_ID"
    )
    LEFT JOIN "DOCTORS" D_DAY ON W."DOCTOR_ID_DAY" = D_DAY."DOCTOR_ID"
    LEFT JOIN "DOCTORS" D_NIGHT ON W."DOCTOR_ID_NIGHT" = D_NIGHT."DOCTOR_ID"
    LEFT JOIN "NURSES" N1 ON W."NURSE_ID_1" = N1."NURSE_ID"
    LEFT JOIN "NURSES" N2 ON W."NURSE_ID_2" = N2."NURSE_ID"
    LEFT JOIN "NURSES" N3 ON W."NURSE_ID_3" = N3."NURSE_ID"
    LEFT JOIN "NURSES" N4 ON W."NURSE_ID_4" = N4."NURSE_ID"
WHERE
    P."PATIENT_ID" = $1;

    `;
    const patientInfoResult = await pool.query(patientInfoQuery, [patientId]);

   
    const patientInfo = patientInfoResult.rows[0];

    if (!patientInfo) {
     
      return res.status(404).json({ error: 'Patient not found' });
    }

   
    res.status(200).json(patientInfo);
  } catch (err) {
    console.error('Error fetching patient information:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/cabinInfoforPatient/:patientId', async (req, res) => {
  const { patientId } = req.params;
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

router.get('/patientsWardHistory/:patientId', async (req, res) => {
  const { patientId } = req.params;

  try {
      
      const wardHistory = await pool.query('SELECT * FROM get_ward_history($1)', [patientId]);

      
      res.status(200).json({ wardHistory });
     
  } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/patientsCabinHistory/:patientId', async (req, res) => {
  const { patientId } = req.params;
  try {
   
    const cabinHistory = await pool.query('SELECT * FROM get_patient_cabin_history($1)', [patientId]);

   
    res.status(200).json({ cabinHistory });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
