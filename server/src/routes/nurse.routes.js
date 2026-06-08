const express = require('express');
const pool = require('../db/pool');

const router = express.Router();

router.get('/nurseDutiesInCabins', async (req, res) => {
  const { nurseId } = req.query;

  try {
    const nurseDutiesQuery = `
      SELECT
        C."CABIN_NO",
        C."CABIN_TYPE",
        C."FLOOR_NO",
        CONCAT(P."FIRST_NAME", ' ', P."LAST_NAME") AS "PATIENT_NAME",
        P."EMAIL_ID" AS "PATIENT_EMAIL_ID",
        P."CONTACT_NO" AS "PATIENT_CONTACT_NO",
        D_DAY."FIRST_NAME" || ' ' || D_DAY."LAST_NAME" AS "DOCTOR_NAME_DAY",
        D_DAY."EMAIL" AS "DOCTOR_EMAIL_DAY",
        D_DAY."CONTACT_NO" AS "DOCTOR_CONTACT_NO_DAY",
        D_NIGHT."FIRST_NAME" || ' ' || D_NIGHT."LAST_NAME" AS "DOCTOR_NAME_NIGHT",
        D_NIGHT."EMAIL" AS "DOCTOR_EMAIL_NIGHT",
        D_NIGHT."CONTACT_NO" AS "DOCTOR_CONTACT_NO_NIGHT",
        CONCAT(N1."FIRST_NAME", ' ', N1."LAST_NAME") AS "NURSE_1_NAME",
        N1."EMAIL_ID" AS "NURSE_1_EMAIL",
        N1."CONTACT_NO" AS "NURSE_1_CONTACT_NO",
        CONCAT(N2."FIRST_NAME", ' ', N2."LAST_NAME") AS "NURSE_2_NAME",
        N2."EMAIL_ID" AS "NURSE_2_EMAIL",
        N2."CONTACT_NO" AS "NURSE_2_CONTACT_NO"
      FROM
        "CABIN" C
        LEFT JOIN "PATIENTS" P ON C."PATIENT_ID" = P."PATIENT_ID"
        LEFT JOIN "DOCTORS" D_DAY ON C."DOCTOR_ID_DAY" = D_DAY."DOCTOR_ID"
        LEFT JOIN "DOCTORS" D_NIGHT ON C."DOCTOR_ID_NIGHT" = D_NIGHT."DOCTOR_ID"
        LEFT JOIN "NURSES" N1 ON C."NURSE_ID_1" = N1."NURSE_ID"
        LEFT JOIN "NURSES" N2 ON C."NURSE_ID_2" = N2."NURSE_ID"
      WHERE
        N1."NURSE_ID" = $1 OR N2."NURSE_ID" = $1;
    `;

    const nurseDutiesResult = await pool.query(nurseDutiesQuery, [nurseId]);
    const nurseDuties = nurseDutiesResult.rows;

    res.status(200).json(nurseDuties);
  } catch (err) {
    console.error('Error fetching nurse duties in cabins:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/nurseDutiesInWards/:nurseId', async (req, res) => {
  const { nurseId } = req.params;
  try {
    const nurseDutiesQuery = `
    SELECT
    W."WARD_NO" AS "WARD_NO",
    W."FLOOR_NO" AS "FLOOR_NO",
    W."DOCTOR_ID_DAY" AS "DOCTOR_ID_DAY",
    D1."FIRST_NAME" || ' ' || D1."LAST_NAME"  AS "DOCTOR_DAY_NAME",
    D1."DEPT_ID" AS "DOCTOR_DAY_DEPT_ID",
    D1."EMAIL" AS "DOCTOR_DAY_EMAIL",
    D1."CONTACT_NO" AS "DOCTOR_DAY_CONTACT",
    D1."SPECIALIZATION" AS "DOCTOR_DAY_SPECIALIZATION",
    W."DOCTOR_ID_NIGHT" AS "DOCTOR_ID_NIGHT",
    D2."FIRST_NAME" || ' ' || D2."LAST_NAME"  AS "DOCTOR_NIGHT_NAME",
    D2."DEPT_ID" AS "DOCTOR_NIGHT_DEPT_ID",
    D2."EMAIL" AS "DOCTOR_NIGHT_EMAIL",
    D2."CONTACT_NO" AS "DOCTOR_NIGHT_CONTACT",
    D2."SPECIALIZATION" AS "DOCTOR_NIGHT_SPECIALIZATION",
    W."NURSE_ID_1" AS "NURSE_ID_1",
    N1."FIRST_NAME" || ' ' || N1."LAST_NAME"  AS "NURSE_1_NAME",
    N1."DEPT_ID" AS "NURSE_1_DEPARTMENT_ID",
    N1."EMAIL_ID" AS "NURSE_1_EMAIL",
    N1."CONTACT_NO" AS "NURSE_1_CONTACT",
    W."NURSE_ID_2" AS "NURSE_ID_2",
    N2."FIRST_NAME" || ' ' || N2."LAST_NAME"  AS "NURSE_2_NAME",
    N2."DEPT_ID" AS "NURSE_2_DEPARTMENT_ID",
    N2."EMAIL_ID" AS "NURSE_2_EMAIL",
    N2."CONTACT_NO" AS "NURSE_2_CONTACT",
    W."NURSE_ID_3" AS "NURSE_ID_3",
    N3."FIRST_NAME" || ' ' ||  N3."LAST_NAME"  AS "NURSE_3_NAME",
    N3."DEPT_ID" AS "NURSE_3_DEPARTMENT_ID",
    N3."EMAIL_ID" AS "NURSE_3_EMAIL",
    N3."CONTACT_NO" AS "NURSE_3_CONTACT",
    W."NURSE_ID_4" AS "NURSE_ID_4",
    N4."FIRST_NAME" || ' ' || N4."LAST_NAME"  AS "NURSE_4_NAME",
    N4."DEPT_ID" AS "NURSE_4_DEPARTMENT_ID",
    N4."EMAIL_ID" AS "NURSE_4_EMAIL",
    N4."CONTACT_NO" AS "NURSE_4_CONTACT",
    W."BED_1" AS "BED_1",
    W."BED_2" AS "BED_2",
    W."BED_3" AS "BED_3",
    W."BED_4" AS "BED_4",
    W."BED_5" AS "BED_5",
    W."BED_6" AS "BED_6",
    W."BED_7" AS "BED_7",
    W."BED_8" AS "BED_8",
    W."BED_9" AS "BED_9",
    W."BED_10" AS "BED_10"
FROM
    "WARD" W
LEFT JOIN
    "DOCTORS" D1 ON W."DOCTOR_ID_DAY" = D1."DOCTOR_ID"
LEFT JOIN
    "DOCTORS" D2 ON W."DOCTOR_ID_NIGHT" = D2."DOCTOR_ID"
LEFT JOIN
    "NURSES" N1 ON W."NURSE_ID_1" = N1."NURSE_ID"
LEFT JOIN
    "NURSES" N2 ON W."NURSE_ID_2" = N2."NURSE_ID"
LEFT JOIN
    "NURSES" N3 ON W."NURSE_ID_3" = N3."NURSE_ID"
LEFT JOIN
    "NURSES" N4 ON W."NURSE_ID_4" = N4."NURSE_ID"
WHERE $1 IN (W."NURSE_ID_1", W."NURSE_ID_2", W."NURSE_ID_3", W."NURSE_ID_4");
    `;
    const nurseDutiesResult = await pool.query(nurseDutiesQuery, [nurseId]);

    
    const nurseDuties = nurseDutiesResult.rows;

    
    res.status(200).json(nurseDuties);
  } catch (err) {
    console.error('Error fetching nurse duties in wards:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/nurseInfo', async (req, res) => {
  try {
   
    const { nurseId } = req.query;

    
    const query = `
      SELECT N.*, D.*, W.*
      FROM "NURSES" N
      LEFT JOIN "DEPARTMENTS" D ON N."DEPT_ID" = D."DEPARTMENT_ID"
      LEFT JOIN "WARD_HISTORY" W ON 
        W."NURSE_ID_1" = N."NURSE_ID" OR
        W."NURSE_ID_2" = N."NURSE_ID" OR
        W."NURSE_ID_3" = N."NURSE_ID" OR
        W."NURSE_ID_4" = N."NURSE_ID"
      WHERE N."NURSE_ID" = $1;
    `;

    
    const { rows } = await pool.query(query, [nurseId]);

    
    res.json(rows);
  } catch (error) {
    
    console.error('Error fetching nurse information:', error);
    res.status(500).json({ error: 'An error occurred while fetching nurse information' });
  }
});

router.get('/availableNurses', async (req, res) => {
  try {
    
    const availableNursesQuery = `
    SELECT "NURSE_ID", "FIRST_NAME" || ' ' || "LAST_NAME" AS "NURSE_NAME"
    FROM "NURSES"
    WHERE "NURSE_ID" NOT IN (
      SELECT "NURSE_ID_1" FROM "WARD"
      UNION
      SELECT "NURSE_ID_2" FROM "WARD"
      UNION
      SELECT "NURSE_ID_3" FROM "WARD"
      UNION
      SELECT "NURSE_ID_4" FROM "WARD"
    )
    AND "NURSE_ID" NOT IN (
      SELECT "NURSE_ID_1" FROM "CABIN"
      UNION
      SELECT "NURSE_ID_2" FROM "CABIN"
    )
    `;
    const availableNursesResult = await pool.query(availableNursesQuery);

    
    const availableNurses = availableNursesResult.rows;
    res.status(200).json(availableNurses);
  } catch (err) {
    console.error('Error fetching available nurses:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
