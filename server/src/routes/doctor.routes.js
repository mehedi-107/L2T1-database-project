const express = require('express');
const pool = require('../db/pool');

const router = express.Router();

router.get('/doctors', async (req, res) => {
  const { department } = req.query;

  try {
    if (department) {
      const result = await pool.query(
        'SELECT * FROM "DOCTORS" JOIN "DEPARTMENTS" ON "DEPT_ID" = "DEPARTMENT_ID" WHERE "DEPARTMENT_NAME" = $1',
        [department]
      );
      return res.json(result.rows);
    }

    const doctors = await pool.query('SELECT * FROM "DOCTORS"');
    return res.json(doctors.rows);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get("/userInfo", async (req, res) => {
  try {
    const { userID } = req.query;
    const user = await pool.query('SELECT * FROM "DOCTORS" WHERE "ID" = $1', [userID]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get('/doctorWardDuty', async (req, res) => {
  try {
      
      const { doctorId } = req.query;
      
      const query = `
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
  WHERE
      W."DOCTOR_ID_DAY" = $1 OR
      W."DOCTOR_ID_NIGHT" = $1;
  
      `;

     
      const { rows } = await pool.query(query, [doctorId]);
      res.json(rows);
  } catch (error) {
      
      console.error('Error fetching ward duty info:', error);
      res.status(500).json({ error: 'An error occurred while fetching ward duty info' });
  }
});

router.get('/doctorCabinDuty', async (req, res) => {
  try {
      
      const { doctorId } = req.query;
      
      const query = `
      SELECT
      W."CABIN_NO" AS "CABIN_NO",
      W."FLOOR_NO" AS "FLOOR_NO",
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
      (W."DOCTOR_ID_DAY" = $1 OR
      W."DOCTOR_ID_NIGHT" = $1)
        AND W."PATIENT_ID" IS NOT NULL; 
      `;

     
      const { rows } = await pool.query(query, [doctorId]);
     
      res.json(rows);
  } catch (error) {
     
      console.error('Error fetching ward duty info:', error);
      res.status(500).json({ error: 'An error occurred while fetching ward duty info' });
  }
});

router.get('/availableDoctors', async (req, res) => {
  try {
    
    const availableDoctorsQuery = `
    SELECT D."DOCTOR_ID", D."FIRST_NAME" || ' ' || D."LAST_NAME" AS "DOCTOR_NAME"
    FROM "DOCTORS" D 
    WHERE D."DOCTOR_ID" NOT IN (SELECT A."DOCTOR_ID_DAY" FROM "CABIN" A)
    AND D."DOCTOR_ID" NOT IN (SELECT B."DOCTOR_ID_NIGHT" FROM "CABIN" B)
    `;
    const availableDoctorsResult = await pool.query(availableDoctorsQuery);

    
    const availableDoctors = availableDoctorsResult.rows;

    
    res.status(200).json(availableDoctors);
  } catch (err) {
    console.error('Error fetching available doctors:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/availableDoctorsWard', async (req, res) => {
  try {
   
    const availableDoctorsQuery = `
    SELECT D."DOCTOR_ID", D."FIRST_NAME" || ' ' || D."LAST_NAME" AS "DOCTOR_NAME"
    FROM "DOCTORS" D 
    WHERE D."DOCTOR_ID" NOT IN (SELECT A."DOCTOR_ID_DAY" FROM "WARD" A)
    AND D."DOCTOR_ID" NOT IN (SELECT B."DOCTOR_ID_NIGHT" FROM "WARD" B)
    `;
    const availableDoctorsResult = await pool.query(availableDoctorsQuery);

    
    const availableDoctors = availableDoctorsResult.rows;
    
    res.status(200).json(availableDoctors);
    
  } catch (err) {
    console.error('Error fetching available doctors:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/doctorRecentActivitiesInWard', async (req, res) => {
  try {
    const { doctor_id,interval } = req.query;

    const query = `
      SELECT * FROM getDoctorActivitiesInWard($1, $2)
    `;
    const { rows } = await pool.query(query, [doctor_id, interval]);
    res.json(rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

router.get('/doctorRecentActivitiesInCabin', async (req, res) => {
  try {
    const { doctor_id,interval } = req.query;
   
    const query = `
      SELECT * FROM getdoctoractivitiesincabin($1, $2)
    `;
    const { rows } = await pool.query(query, [doctor_id, interval]);
    
    res.json(rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

router.post("/addDoctor", async (req, res) => {
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
      let maxId = await pool.query('SELECT MAX("DOCTOR_ID") as max FROM "DOCTORS"');
      
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

    return res.status(201).json({ success: true, message: "Doctor added successfully", doctor: newDoctor.rows[0] });
  } catch (error) {
    console.error("Error adding doctor:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
