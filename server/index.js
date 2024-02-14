const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const { addDays, format, addMinutes } = require('date-fns');

app.use(cors());
app.use(express.json());

app.listen(5000, () => {
  console.log("Server has started on port 5000");
});

app.post("/login", async (req, res) => {
  // ... (copy your login route from index.js)
  try {
    const { userID, password } = req.body;
    console.log(userID);
    console.log(password);
    let x=Math.floor(userID/10000);
    console.log(x);
    if (x === 1) {
      const user = await pool.query(
        'SELECT * FROM "DOCTORS" WHERE "DOCTOR_ID" = $1 AND "PASSWORD" = $2',
        [userID, password]);
      if (user.rows.length === 0) {
        console.log("Invalid user ID or password");
        return res.status(401).json({ success: false, message: "Invalid user ID or password" });
      }
      console.log(user.rows[0]);
      return res.status(200).json({ success: true, message: "Login successful", user: user.rows[0] });
    }
    if (x === 2) {
      console.log("Patient");
      const user = await pool.query(
        'SELECT * FROM "PATIENTS" WHERE "PATIENT_ID" = $1 AND "PASSWORD" = $2',
        [userID, password]);
      if (user.rows.length === 0) {
        console.log("Invalid user ID or password");
        return res.status(401).json({ success: false, message: "Invalid user ID or password" });
      }
      console.log(user.rows[0]);
      return res.status(200).json({ success: true, message: "Login successful", user: user.rows[0] });
    }
    if (x === 3) {
      const user = await pool.query(
        'SELECT * FROM "NURSES" WHERE "NURSE_ID" = $1 AND "PASSWORD" = $2',
        [userID, password]);
      if (user.rows.length === 0) {
        console.log("Invalid user ID or password");
        return res.status(401).json({ success: false, message: "Invalid user ID or password" });
      }
      console.log(user.rows[0]);
      return res.status(200).json({ success: true, message: "Login successful", user: user.rows[0] });
    }
    console.log("Invalid user ID or password");
    return res.status(401).json({ success: false, message: "Invalid user ID or password" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


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
    // await pool.query(
    //   'SELECT * FROM "PATIENTS" WHERE "ID" = $1 AND "PASSWORD" = $2',[nextId, PASSWORD]
    // ).then((user) => {
    //   console.log(user.rows[0]);
    //   return res.status(200).json({ success: true, message: "Login successful", user: user.rows[0] });
    // });
    res.status(201).json({ success: true, message: "Signup successful" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
app.post("/changePassword", async (req, res) => {
  try {
    const { userID, currentPassword, newPassword } = req.body;

    console.log("Received change password data:", req.body);
    const user = await pool.query('SELECT * FROM "DOCTORS" WHERE "DOCTOR_ID" = $1 AND "PASSWORD" = $2', [userID, currentPassword]);
    if (user.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Current password is incorrect." });
    }


    await pool.query('UPDATE "DOCTORS" SET "PASSWORD" = $1 WHERE "DOCTOR_ID" = $2', [newPassword, userID]);

    return res.status(200).json({ success: true, message: "Password changed successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/userInfo", async (req, res) => {
  try {
    const { userID } = req.query;
    console.log(userID);
    const user = await pool.query('SELECT * FROM "DOCTORS" WHERE "ID" = $1', [userID]);
    console.log(user.rows[0]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/lastUserID", async (req, res) => {
  try {
    const lastUserID = await pool.query('SELECT MAX("PATIENT_ID") FROM "PATIENTS"');
    console.log(lastUserID.rows[0]);
    res.json(lastUserID.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// Add this route to index.js
app.get("/appointments", async (req, res) => {
  if(req.query.patientId){
    try {
      const { patientId } = req.query;
      console.log("Patient",patientId);
      const currentDate = new Date().toISOString().split('T')[0]; // Get current date in 'YYYY-MM-DD' format
      const appointments = await pool.query(
        'SELECT  A."APPOINTMENT_ID", A."APPOINTMENT_DATE", A."START_TIME", (A."START_TIME" + INTERVAL \'15 minutes\') AS END_TIME, D."DOCTOR_ID", D."FIRST_NAME", D."LAST_NAME", D."EMAIL", D."CONTACT_NO" FROM "APPOINTMENT" A JOIN "DOCTORS" D ON A."DOCTOR_ID" = D."DOCTOR_ID" WHERE A."PATIENT_ID" = $1 AND "APPOINTMENT_DATE" >= $2',
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
    const appointments = await pool.query('SELECT * FROM "APPOINTMENT" WHERE "DOCTOR_ID" = $1 AND "APPOINTMENT_DATE" > $2', [doctorId, currentDate]);
    res.json(appointments.rows);
    console.log(appointments.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }

});


app.get('/allocatedCabins', async (req, res) => {
  try {
    const { patientId } = req.query;
    console.log(patientId);
    // Adjust the SQL query based on your database schema
    const query = `
      SELECT *
      FROM "CABIN"
      WHERE "PATIENT_ID" = $1;
    `;

    const result = await pool.query(query, [patientId]);
    res.json(result.rows);
    console.log(result.rows);
  } catch (error) {
    console.error('Error fetching allocated cabins:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/allocatedWards', async (req, res) => {
  const { patientId } = req.query;

  try {
    console.log(patientId, "patientId");
    const result = await pool.query(
      'SELECT * FROM "WARD" WHERE $1 IN ( "BED_1", "BED_2", "BED_3", "BED_4", "BED_5", "BED_6", "BED_7", "BED_8", "BED_9", "BED_10" )',
      [patientId]
    );

    res.json(result.rows);
    console.log(result.rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/nurseDutiesInCabins', async (req, res) => {
  const { nurseId } = req.query;

  try {
    // Replace 'your_table_name' and 'your_nurse_id_column' with the actual table and column names
    const result = await pool.query(
      'SELECT * FROM "CABIN" WHERE $1 IN("NURSE_ID_1", "NURSE_ID_2")',
      [nurseId]
    );

    res.json(result.rows);
    console.log(result.rows);
  } catch (error) {
    console.error('Error fetching nurse duties in cabins:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/nurseDutiesInWards', async (req, res) => {
  const { nurseId } = req.query;

  try {
    // Replace 'your_table_name' and 'your_nurse_id_column' with the actual table and column names
    const result = await pool.query(
      'SELECT * FROM "WARD" WHERE $1 IN("NURSE_ID_1", "NURSE_ID_2","NURSE_ID_3","NURSE_ID_4")',
      [nurseId]
    );
      console.log(result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching nurse duties in wards:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/departments', async (req, res) => {
  try {
    console.log("departments");
    const result = await pool.query('SELECT * FROM "DEPARTMENTS"');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/doctors', async (req, res) => {
  const { department } = req.query;

  try {
    console.log(department);
    const result = await pool.query('SELECT * FROM "DOCTORS" JOIN "DEPARTMENTS" ON "DEPT_ID"="DEPARTMENT_ID" WHERE "DEPARTMENT_NAME"=$1', [department]);
    res.json(result.rows);
    console.log(result.rows);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





app.get('/availableTimeSlots', async (req, res) => {
  try {
      const { doctor } = req.query;

      // Get the current date
      const currentDate = new Date();

      // Generate time slots for the upcoming 7 days
      const availableTimeSlots = [];

      for (let i = 0; i < 3; i++) {
          const currentDateFormatted = format(addDays(currentDate, i), 'yyyy-MM-dd');

          // Calculate the time range for the given doctor
          
          let startTime = '08:00:00';
          let endTime = '12:00:00';
          if(doctor >10100){
            startTime = '18:00:00';
            endTime = '22:00:00';
          }

          // Query to fetch occupied time slots for a specific date and doctor
          const query = `
              SELECT "START_TIME" FROM "APPOINTMENT"
              WHERE "DOCTOR_ID" = $1 AND "APPOINTMENT_DATE" = $2
              ORDER BY "START_TIME";
          `;

          const result = await pool.query(query, [doctor, currentDateFormatted]);

          const occupiedTimeSlots = new Set(result.rows.map(row => row.START_TIME));

          // Generate available time slots within the specified time range
          let currentTime = new Date(`${currentDateFormatted} ${startTime}`);

          while (currentTime < new Date(`${currentDateFormatted} ${endTime}`)) {
              const timeSlot = format(currentTime, 'HH:mm:ss');

              if (!occupiedTimeSlots.has(timeSlot)) {
                  // Include both date and time in the response
                  const dateTimeSlot = {
                      date: format(currentTime, 'yyyy-MM-dd'),
                      time: timeSlot,
                  };

                  availableTimeSlots.push(dateTimeSlot);
              }

              currentTime = addMinutes(currentTime, 15);
          }
      }

      res.json(availableTimeSlots);
  } catch (error) {
      console.error('Error fetching available time slots:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/submitAppointment', async (req, res) => {
  try {
    const { doctor, time, date, patientId } = req.body;

    // Step 1: Select the highest appointment ID
    const selectMaxAppointmentIdQuery = `
      SELECT MAX("APPOINTMENT_ID") as max_id FROM "APPOINTMENT";
    `;

    const maxIdResult = await pool.query(selectMaxAppointmentIdQuery);
    const nextAppointmentId = maxIdResult.rows[0].max_id + 1;

    // Step 2: Insert the new appointment with the calculated ID
    const insertAppointmentQuery = `
      INSERT INTO "APPOINTMENT" ("APPOINTMENT_ID", "DOCTOR_ID", "APPOINTMENT_DATE", "START_TIME", "PATIENT_ID")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const result = await pool.query(insertAppointmentQuery, [nextAppointmentId, doctor, date, time, patientId]);

    res.json({ success: true, appointment: result.rows[0] });
  } catch (error) {
    console.error('Error submitting appointment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
