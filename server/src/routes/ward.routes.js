const express = require('express');
const pool = require('../db/pool');

const router = express.Router();

router.put('/updateWardDetails/:wardNo', async (req, res) => {
  const wardNo = req.params.wardNo;
  const updatedDetails = req.body; 

  try {
    
    const ward = wardNo % 100;
    const floor = Math.floor(wardNo / 100);
    
    if (updatedDetails.DOCTOR_ID_DAY === updatedDetails.DOCTOR_ID_NIGHT) {
      return res.status(400).json({ error: 'Doctor IDs for day and night shifts should be different' });
    }
    
    const updateQuery = `
      UPDATE "WARD"
      SET "DOCTOR_ID_DAY" = $1, "DOCTOR_ID_NIGHT" = $2, "NURSE_ID_1" = $3, "NURSE_ID_2" = $4,
      "NURSE_ID_3" = $5, "NURSE_ID_4" = $6
      WHERE "WARD_NO" = $7 AND "FLOOR_NO" = $8
    `;
    const { DOCTOR_ID_DAY, DOCTOR_ID_NIGHT, NURSE_ID_1, NURSE_ID_2, NURSE_ID_3, NURSE_ID_4 } = updatedDetails;
    await pool.query(updateQuery, [DOCTOR_ID_DAY, DOCTOR_ID_NIGHT, NURSE_ID_1, NURSE_ID_2, NURSE_ID_3, NURSE_ID_4, ward, floor]);
    res.status(200).json({ message: 'Ward details updated successfully' });
  } catch (error) {
    console.error('Error updating ward details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/wardHistory', async (req, res) => {
  const { wardNo,date } = req.query;
  
  try {
    const ward = wardNo % 100;
    const floor = Math.floor(wardNo / 100);
    
    const wardHistoryQuery = `
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
    "WARD_HISTORY" W
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
WHERE W."WARD_NO" = $1 AND W."FLOOR_NO" = $2 AND W."DATE" = $3;
    `;
    const wardHistoryResult = await pool.query(wardHistoryQuery, [ward, floor, date]);

    
    const wardHistory = wardHistoryResult.rows;
   
    res.status(200).json({ wardHistory });
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/wardInfo/:wardId', async (req, res) => {
  try {
    const { wardId } = req.params;
    const floorNo = Math.floor(wardId / 100); 
    const wardNo = wardId % 100;
    const query = `
    SELECT
    W."WARD_NO" AS "WARD_NO",
    W."FLOOR_NO" AS "FLOOR_NO",
    W."DOCTOR_ID_DAY" AS "DOCTOR_ID_DAY",
    W."DOCTOR_ID_NIGHT" AS "DOCTOR_ID_NIGHT",
    W."BED_1" AS "BED_1",
    W."BED_2" AS "BED_2",
    W."BED_3" AS "BED_3",
    W."BED_4" AS "BED_4",
    W."BED_5" AS "BED_5",
    W."BED_6" AS "BED_6",
    W."BED_7" AS "BED_7",
    W."BED_8" AS "BED_8",
    W."BED_9" AS "BED_9",
    W."BED_10" AS "BED_10",
    W."ADMISSION_REASON" AS "ADMISSION_REASON",
    W."NURSE_ID_1" AS "NURSE_ID_1",
    W."NURSE_ID_2" AS "NURSE_ID_2",
    W."NURSE_ID_3" AS "NURSE_ID_3",
    W."NURSE_ID_4" AS "NURSE_ID_4",
    D1."FIRST_NAME" AS "DOCTOR_DAY_FIRST_NAME",
    D1."LAST_NAME" AS "DOCTOR_DAY_LAST_NAME",
    D1."EMAIL" AS "DOCTOR_DAY_EMAIL",
    D1."CONTACT_NO" AS "DOCTOR_DAY_CONTACT_NO",
    D2."FIRST_NAME" AS "DOCTOR_NIGHT_FIRST_NAME",
    D2."LAST_NAME" AS "DOCTOR_NIGHT_LAST_NAME",
    D2."EMAIL" AS "DOCTOR_NIGHT_EMAIL",
    D2."CONTACT_NO" AS "DOCTOR_NIGHT_CONTACT_NO",
    CONCAT_WS(' ', N1."FIRST_NAME", N1."LAST_NAME") AS "NURSE_1_FULL_NAME",
    N1."EMAIL_ID" AS "NURSE_1_EMAIL",
    N1."CONTACT_NO" AS "NURSE_1_CONTACT_NO",
    CONCAT_WS(' ', N2."FIRST_NAME", N2."LAST_NAME") AS "NURSE_2_FULL_NAME",
    N2."EMAIL_ID" AS "NURSE_2_EMAIL",
    N2."CONTACT_NO" AS "NURSE_2_CONTACT_NO",
    CONCAT_WS(' ', N3."FIRST_NAME", N3."LAST_NAME") AS "NURSE_3_FULL_NAME",
    N3."EMAIL_ID" AS "NURSE_3_EMAIL",
    N3."CONTACT_NO" AS "NURSE_3_CONTACT_NO",
    CONCAT_WS(' ', N4."FIRST_NAME", N4."LAST_NAME") AS "NURSE_4_FULL_NAME",
    N4."EMAIL_ID" AS "NURSE_4_EMAIL",
    N4."CONTACT_NO" AS "NURSE_4_CONTACT_NO"
FROM
    "WARD" AS W
LEFT JOIN
    "DOCTORS" AS D1 ON W."DOCTOR_ID_DAY" = D1."DOCTOR_ID"
LEFT JOIN
    "DOCTORS" AS D2 ON W."DOCTOR_ID_NIGHT" = D2."DOCTOR_ID"
LEFT JOIN
    "NURSES" AS N1 ON W."NURSE_ID_1" = N1."NURSE_ID"
LEFT JOIN
    "NURSES" AS N2 ON W."NURSE_ID_2" = N2."NURSE_ID"
LEFT JOIN
    "NURSES" AS N3 ON W."NURSE_ID_3" = N3."NURSE_ID"
LEFT JOIN
    "NURSES" AS N4 ON W."NURSE_ID_4" = N4."NURSE_ID"
WHERE
    W."WARD_NO" = $1 AND W."FLOOR_NO" = $2;

    `;

    const { rows } = await pool.query(query, [wardNo, floorNo]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching ward duty info:', error);
    res.status(500).json({ error: 'An error occurred while fetching ward duty info' });
  }
});

module.exports = router;
