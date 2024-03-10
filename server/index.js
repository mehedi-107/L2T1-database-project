const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const { addDays, format, addMinutes, max } = require('date-fns');

app.use(cors());
app.use(express.json());

app.listen(5000, () => {
  console.log("Server has started on port 5000");
});

app.get('/doctors', async (req, res) => {
  try {
    
    const doctors = await pool.query('SELECT * FROM "DOCTORS"'); 
    res.json(doctors.rows);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { userID, password } = req.body;
    console.log(userID);
    console.log(password);
    let x=Math.floor(userID/10000);
    //console.log(x);
    if (x === 1) {
      const user = await pool.query(
        'SELECT * FROM "DOCTORS" WHERE "DOCTOR_ID" = $1 AND "PASSWORD" = $2',
        [userID, password]);
      if (user.rows.length === 0) {
        console.log("Invalid user ID or password");
        return res.status(401).json({ success: false, message: "Invalid user ID or password" });
      }
      //console.log(user.rows[0]);
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
      //console.log(user.rows[0]);
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
      //console.log(user.rows[0]);
      return res.status(200).json({ success: true, message: "Login successful", user: user.rows[0] });
    }
    console.log("Invalid user ID or password");
    return res.status(401).json({ success: false, message: "Invalid user ID or password" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/userInfo", async (req, res) => {
  try {
    const { userID } = req.query;
    console.log(userID);
    const user = await pool.query('SELECT * FROM "DOCTORS" WHERE "ID" = $1', [userID]);
    //console.log(user.rows[0]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/lastUserID", async (req, res) => {
  try {
    const lastUserID = await pool.query('SELECT MAX("PATIENT_ID") FROM "PATIENTS"');
    //console.log(lastUserID.rows[0]);
    res.json(lastUserID.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get('/allocatedCabins', async (req, res) => {
  try {
    const { patientId } = req.query;
    //console.log(patientId);
    const query = `
      SELECT *
      FROM "CABIN"
      WHERE "PATIENT_ID" = $1;
    `;

    const result = await pool.query(query, [patientId]);
    res.json(result.rows);
    //console.log(result.rows);
  } catch (error) {
    console.error('Error fetching allocated cabins:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/allocatedWards', async (req, res) => {
  const { patientId } = req.query;

  try {
    //console.log(patientId, "patientId");
    const result = await pool.query(
      'SELECT * FROM "WARD" WHERE $1 IN ( "BED_1", "BED_2", "BED_3", "BED_4", "BED_5", "BED_6", "BED_7", "BED_8", "BED_9", "BED_10" )',
      [patientId]
    );

    res.json(result.rows);
    //console.log(result.rows);
  } catch (error) {
    console.error('Error executing query:', error);
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

app.get('/cabinTypes', async (req, res) => {  
  try {
    const cabinTypes = await pool.query('SELECT DISTINCT "CABIN_TYPE" FROM "CABIN"');
    res.json(cabinTypes.rows);
  } catch (error) {
    console.error('Error fetching cabin types:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/displayLeaveApplications', async (req, res) => {
  try {
    const leaveApplications = await pool.query(`
    SELECT *
    FROM "LEAVE_REQUESTS" 
    WHERE "APPROVAL" = 'Pending';
    `);
    res.json(leaveApplications.rows); 
  }
  
  catch (error) {
    console.error('Error fetching leave applications:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/applicantInfo/:applicantId', async (req, res) => {  
  try {
    const { applicantId } = req.params;
    console.log(applicantId);
    if(Math.floor(applicantId/10000)==1){
      const query = `
      SELECT
      "DOCTOR_ID" AS "STAFF_ID",
      "FIRST_NAME",
      "LAST_NAME",
      "EMAIL",
      "CONTACT_NO",
      "SPECIALIZATION" AS "DEPARTMENT"
      FROM "DOCTORS"
      WHERE "DOCTOR_ID" = $1;
      `;
      const { rows } = await pool.query(query, [applicantId]);
      res.json(rows[0]);
    }
    else if(Math.floor(applicantId/10000)==3){
      const query = `
      SELECT
      "NURSE_ID" AS "STAFF_ID",
      "FIRST_NAME",
      "LAST_NAME",
      "EMAIL_ID" AS "EMAIL",
      "CONTACT_NO",
      "DEPT_ID" AS "DEPARTMENT"
      FROM "NURSES"
      WHERE "NURSE_ID" = $1;
      `;
      const { rows } = await pool.query(query, [applicantId]);
      res.json(rows[0]);
    }
    else{
      res.status(404).json({ error: 'Staff information not found' });
    }
  } catch (error) {
    console.error('Error fetching applicant information:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get("/receivedMessages/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId);
    // Calculate the lower bound date (7 days ago)
    const lowerBoundDate = new Date();
    lowerBoundDate.setDate(lowerBoundDate.getDate() - 7);

   
    const derivedToValue = Math.floor(userId / 10000) * 10000;
    const notifications = await pool.query(
      `SELECT "DATE", "TIME", "FROM", "TO", "MESSAGE" FROM "NOTIFICATIONS" 
      WHERE ("TO" = $1 OR "TO" = $2) AND "DATE" >= $3`,
      [userId, derivedToValue, lowerBoundDate]
    );
    
    const formattedNotifications = notifications.rows.map(notification => {
      const utcDate = new Date(notification.DATE);
      const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
      const formattedDate = localDate.toISOString().split('T')[0];
      return {
        DATE: formattedDate,
        TIME: notification.TIME,
        FROM: notification.FROM,
        TO: notification.TO,
        MESSAGE: notification.MESSAGE
      };
    });
    
    return res.status(200).json({ success: true, notifications: formattedNotifications });
    
  } catch (error) {
    console.error("Error retrieving notifications:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


app.get("/sentMessages", async (req, res) => {
  try {
    const { userId } = req.body;

    const lowerBoundDate = new Date();
    lowerBoundDate.setDate(lowerBoundDate.getDate() - 7);
    const sentMessages = await pool.query(
      `SELECT "DATE", "TIME", "FROM", "TO", "MESSAGE" FROM "NOTIFICATIONS" 
      WHERE "FROM" = $1 AND "DATE" >= $2`,
      [userId, lowerBoundDate]
    );
    
    const formattedSentMessages = sentMessages.rows.map(message => {
      const utcDate = new Date(message.DATE);
      const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
      const formattedDate = localDate.toISOString().split('T')[0];
      return {
        DATE: formattedDate,
        TIME: message.TIME,
        FROM: message.FROM,
        TO: message.TO,
        MESSAGE: message.MESSAGE
      };
    });
    
    return res.status(200).json({ success: true, sentMessages: formattedSentMessages });    
  } catch (error) {
    console.error("Error retrieving notifications:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get('/doctors', async (req, res) => {
  const { department } = req.query;

  try {
    console.log(department);
    const result = await pool.query('SELECT * FROM "DOCTORS" JOIN "DEPARTMENTS" ON "DEPT_ID"="DEPARTMENT_ID" WHERE "DEPARTMENT_NAME"=$1', [department]);
    res.json(result.rows);
    //console.log(result.rows);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/availableTimeSlots', async (req, res) => {
  try {
    const { doctor, date } = req.query;
    let startTime = '08:00:00';
    let endTime = '12:00:00';
    if (doctor > 10100) {
      startTime = '18:00:00';
      endTime = '22:00:00';
    }
    const query = `
      SELECT "START_TIME" 
      FROM "APPOINTMENT"
      WHERE "DOCTOR_ID" = $1 
      AND "APPOINTMENT_DATE" = $2
      ORDER BY "START_TIME";
    `;

    const result = await pool.query(query, [doctor, date]);

    const occupiedTimeSlots = new Set(result.rows.map(row => row.START_TIME));
    const availableTimeSlots = [];
    let currentTime = new Date(`${date} ${startTime}`);

    while (currentTime < new Date(`${date} ${endTime}`)) {
      const timeSlot = format(currentTime, 'HH:mm:ss');

      if (!occupiedTimeSlots.has(timeSlot)) {
        const dateTimeSlot = {
          date,
          time: timeSlot,
        };

        availableTimeSlots.push(dateTimeSlot);
      }

      currentTime = addMinutes(currentTime, 15);
    }

    res.json(availableTimeSlots);
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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

app.post('/submitAppointment', async (req, res) => {
  try {
    const { doctor, time, date, patientId } = req.body;

    console.log('Received appointment data:', req.body);
    const selectMaxAppointmentIdQueryFromMedicalRecord = `
      SELECT MAX("APPOINTMENT_ID") as max_id FROM "MEDICAL_RECORD_PATIENT";
    `;

    const maxIdResultFromMedicalRecord = await pool.query(selectMaxAppointmentIdQueryFromMedicalRecord);

    //console.log(maxIdResultFromMedicalRecord.rows[0].max_id);
    const nextAppointmentId = maxIdResultFromMedicalRecord.rows[0].max_id + 1;

   
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

app.post('/leaveApplication', async (req, res) => {
  const { staffId, startDate, endDate, reason } = req.body;

  try {
    const insertQuery = `
      INSERT INTO "LEAVE_REQUESTS" ("APPLICANT_ID", "REASON_FOR_LEAVE", "START_DATE", "END_DATE")
      VALUES ($1, $2, $3, $4)
    `;
    await pool.query(insertQuery, [staffId, reason, startDate, endDate]);
    console.log("Leave application submitted successfully");
    res.status(200).send('Leave application submitted successfully');
  } catch (error) {
    console.error('Error submitting leave application:', error);
    res.status(500).send('An error occurred while processing the request');
  }
});

app.post("/patientCabinCheckOut", async (req, res) => {
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
    console.log("Patient checked out successfully.");
    return res.status(200).json({ success: true, message: "Patient checked out successfully." });
  } catch (error) {
    console.error("Error checking out patient from cabin:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/patientWardCheckOut", async (req, res) => {
  try {
    const { patientId } = req.body;
    console.log("hgcf",patientId);
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
    await pool.query(
      `INSERT INTO "WARD_HISTORY" ("DATE", "WARD_NO", "FLOOR_NO", "DOCTOR_ID_DAY", "DOCTOR_ID_NIGHT", "BED_1", "BED_2", "BED_3", "BED_4", "BED_5", "BED_6", "BED_7", "BED_8", "BED_9", "BED_10", "NURSE_ID_1", "NURSE_ID_2", "NURSE_ID_3", "NURSE_ID_4", "WARD_BOY_ID_1", "WARD_BOY_ID_2", "WARD_BOY_ID_3", "WARD_BOY_ID_4", "WARD_BOY_ID_5") 
      VALUES (CURRENT_DATE, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)`,
      [ward["WARD_NO"], ward["FLOOR_NO"], ward["DOCTOR_ID_DAY"], ward["DOCTOR_ID_NIGHT"], ward["BED_1"], ward["BED_2"], ward["BED_3"], ward["BED_4"], ward["BED_5"], ward["BED_6"], ward["BED_7"], ward["BED_8"], ward["BED_9"], ward["BED_10"], ward["NURSE_ID_1"], ward["NURSE_ID_2"], ward["NURSE_ID_3"], ward["NURSE_ID_4"], ward["WARD_BOY_ID_1"], ward["WARD_BOY_ID_2"], ward["WARD_BOY_ID_3"], ward["WARD_BOY_ID_4"], ward["WARD_BOY_ID_5"]]
    );

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


app.post("/sendMessage", async (req, res) => {
  try {
    const { from, to, message } = req.body;
    const currentDate = new Date().toISOString().slice(0, 10); 
    const currentTime = new Date().toISOString().slice(11, 19); 

    await pool.query(
      'INSERT INTO "NOTIFICATIONS" ("DATE", "TIME", "FROM", "TO", "MESSAGE") VALUES ($1, $2, $3, $4, $5)',
      [currentDate, currentTime, from, to, message]
    );

    return res.status(200).json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/deleteMessage", async (req, res) => {
  try {
    const { date, time, from, to } = req.body;
    await pool.query(
      'DELETE FROM "NOTIFICATIONS" WHERE "DATE" = $1 AND "TIME" = $2 AND "FROM" = $3 AND "TO" = $4',
      [date, time, from, to]
    );

    return res.status(200).json({ success: true, message: "Message deleted successfully." });
  } catch (error) {
    console.error("Error deleting message:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


app.post('/cancelAppointment/:appointmentId', async (req, res) => {
  const { appointmentId } = req.params;
  console.log(appointmentId);
  try {
    
    const result = await pool.query('DELETE FROM "APPOINTMENT" WHERE "APPOINTMENT_ID" = $1', [appointmentId]);
   const re = await pool.query('UPDATE "MEDICAL_RECORD_PATIENT" SET "RESULT" = $2, "SERVICE_DATE" = CURRENT_DATE WHERE "APPOINTMENT_ID" = $1', [appointmentId, "Cancelled"]);
    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Appointment cancelled successfully' });
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'An error occurred while cancelling the appointment' });
  }
});

app.post('/remove/:id', (req, res) => {
  const employeeId = parseInt(req.params.id);
  console.log(employeeId);
  try {
    if (Math.floor(employeeId / 10000) === 1) {
      
      const result= pool.query('DELETE FROM "DOCTORS" WHERE "DOCTOR_ID" = $1', [employeeId]);
      console.log(result);
      res.status(200).json({ message: 'Doctor removed successfully.' });
    } else if (Math.floor(employeeId/ 10000) === 3) {
      
      const result= pool.query('DELETE FROM "NURSES" WHERE "NURSE_ID" = $1', [employeeId]);
      console.log(result);
      res.status(200).json({ message: 'Nurse removed successfully.' });
    } else {
      res.status(400).json({ message: 'Invalid employee ID.' });
    }
  } catch (error) {
    console.error('Error removing employee:', error.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.get("/changePassword/:userID/:currentPassword/:newPassword/:userType", async (req, res) => {
  try {
    const { userID, currentPassword, newPassword, userType } = req.params; 
    console.log(req.params);
    let tableName;
    if (userType === 'doctor') {
      tableName = 'DOCTORS';
    } else if (userType === 'nurse') {
      tableName = 'NURSES';
    } else if (userType === 'patient') {
      tableName = 'PATIENTS';
    } else {
      console.log(userType);
      return res.status(400).json({ success: false, message: "Invalid user type." });
    }

    const user = await pool.query(`SELECT * FROM "${tableName}" WHERE "${userType.toUpperCase()}_ID" = $1 AND "PASSWORD" = $2`, [userID, currentPassword]);
    
    if(user.rows.length === 0) {  
      console.log("Invalid current password");
      const a="Invalid current password";
      res.status(200).json({ success: true, message: "Password changed successfully", triggerMessage: a});
      return;
    }
    

    
    await pool.query(`UPDATE "${tableName}" SET "PASSWORD" = $1 WHERE "${userType.toUpperCase()}_ID" = $2`, [newPassword, userID]);
    
    
    const triggerMsg = await pool.query(`SELECT "message" FROM "TRIGGER_MESSAGES" ORDER BY "id" DESC LIMIT 1`);
    const message = triggerMsg.rows[0].message;

    console.log(message);
    res.status(200).json({ success: true, message: "Password changed successfully", triggerMessage: message });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


app.put('/updateCabinDetails/:cabinId', async (req, res) => {
  const cabinId = req.params.cabinId;

  const updatedDetails = req.body; 
  console.log(cabinId, updatedDetails);
  try {
    
    if (updatedDetails.DOCTOR_ID_DAY === updatedDetails.DOCTOR_ID_NIGHT) {
      return res.status(400).json({ error: 'Doctor IDs for day and night shifts should be different' });
    }
    floorNo = Math.floor(cabinId / 100);
    cabinNo = cabinId % 100;
    
    const updateQuery = `
      UPDATE "CABIN"
      SET "DOCTOR_ID_DAY" = $1, "DOCTOR_ID_NIGHT" = $2, "NURSE_ID_1" = $3, "NURSE_ID_2" = $4
      WHERE "CABIN_NO" = $5 AND "FLOOR_NO" = $6
    `;
    const { DOCTOR_ID_DAY, DOCTOR_ID_NIGHT, NURSE_ID_1, NURSE_ID_2 } = updatedDetails;
    
    await pool.query(updateQuery, [DOCTOR_ID_DAY, DOCTOR_ID_NIGHT, NURSE_ID_1, NURSE_ID_2, cabinNo, floorNo]);
    //console.log("Updated cabin details: ", updatedDetails);
    //console.log(updatedDetails);
    
    res.status(200).json({ message: 'Cabin details updated successfully' });
  } catch (error) {
    console.error('Error updating cabin details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/markCompleted', async (req, res) => {
  try {
    const { appointmentId, result } = req.body;

    //console.log('Received appointment ID:', appointmentId);
    //console.log('Received result:', result);

    // Update the APPOINTMENT table to mark the appointment as completed

    // Update the MEDICAL_RECORD_PATIENT table with the result and current date
    await pool.query('UPDATE "MEDICAL_RECORD_PATIENT" SET "RESULT" = $2, "SERVICE_DATE" = CURRENT_DATE WHERE "APPOINTMENT_ID" = $1', [appointmentId, result]);


    res.json({ success: true });
  } catch (error) {
    console.error('Error marking appointment as completed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/updateWardDetails/:wardNo', async (req, res) => {
  const wardNo = req.params.wardNo;
  console.log(wardNo);
  const updatedDetails = req.body; 

  try {
    
    ward = wardNo % 100;
    floor = Math.floor(wardNo / 100);
    
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
    console.log(updatedDetails);
    await pool.query(updateQuery, [DOCTOR_ID_DAY, DOCTOR_ID_NIGHT, NURSE_ID_1, NURSE_ID_2, NURSE_ID_3, NURSE_ID_4, ward, floor]);
    console.log("Updated ward details: ", updatedDetails);
    res.status(200).json({ message: 'Ward details updated successfully' });
  } catch (error) {
    console.error('Error updating ward details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get("/appointments", async (req, res) => {
  if(req.query.patientId){
    try {
      const { patientId } = req.query;
      console.log("Patient",patientId);
      const currentDate = new Date().toISOString().split('T')[0]; // Get current date in 'YYYY-MM-DD' format
      const appointments = await pool.query(
        'SELECT  A."REASON",A."APPOINTMENT_ID", A."APPOINTMENT_DATE", A."START_TIME", (A."START_TIME" + INTERVAL \'15 minutes\') AS END_TIME, D."DOCTOR_ID", D."FIRST_NAME", D."LAST_NAME", D."EMAIL", D."CONTACT_NO" FROM "APPOINTMENT" A JOIN "DOCTORS" D ON A."DOCTOR_ID" = D."DOCTOR_ID" WHERE A."PATIENT_ID" = $1 AND "APPOINTMENT_DATE" >= $2',
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
    const appointments = await pool.query(
      `
      SELECT P.*,A.*,B."AMOUNT_PAID",B."AMOUNT_DUE"
FROM "PATIENTS" P JOIN "APPOINTMENT" A ON P."PATIENT_ID"=A."PATIENT_ID" 
JOIN "BILLING" B ON B."APPOINTMENT_ID"=A."APPOINTMENT_ID"
WHERE A."DOCTOR_ID"=$1 AND "APPOINTMENT_DATE" > $2 
      `, 
      [doctorId, currentDate]);
    res.json(appointments.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }

});


app.get('/nurseDutiesInCabins', async (req, res) => {
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

app.get('/nurseDutiesInWards/:nurseId', async (req, res) => {
  const { nurseId } = req.params;
  console.log(nurseId);
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

app.get('/doctorWardDuty', async (req, res) => {
  try {
      
      const { doctorId } = req.query;
      console.log(doctorId);
      
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

app.get('/doctorCabinDuty', async (req, res) => {
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
      //console.log(rows);
     
      res.json(rows);
  } catch (error) {
     
      console.error('Error fetching ward duty info:', error);
      res.status(500).json({ error: 'An error occurred while fetching ward duty info' });
  }
});

app.get('/nurseInfo', async (req, res) => {
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

app.get('/wardHistory', async (req, res) => {
  const { wardNo,date } = req.query;
  
  try {
    ward = wardNo%100;
    floor = Math.floor(wardNo/100);
    console.log(ward, floor, date);
    
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
   //console.log(wardNo, floorNo, date);
    const wardHistoryResult = await pool.query(wardHistoryQuery, [ward, floor, date]);

    
    const wardHistory = wardHistoryResult.rows;
   // console.log(wardHistory);
   
    res.status(200).json({ wardHistory });
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/cabinDetails/:cabinId', async (req, res) => {
  const { cabinId } = req.params;
  console.log(cabinId);
  try {
    floorNo = Math.floor(cabinId / 100);
    
    cabinNo = cabinId % 100;
    console.log(floorNo, cabinNo);
    
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

    
    res.json(cabinDetails.rows[0]);
   // console.log(cabinDetails.rows[0]);
  } catch (error) {
    console.error('Error fetching cabin details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/availableDoctors', async (req, res) => {
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
    //console.log(availableDoctors);
  } catch (err) {
    console.error('Error fetching available doctors:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/availableNurses', async (req, res) => {
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
    //console.log(availableNurses);
  } catch (err) {
    console.error('Error fetching available nurses:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/wardInfo/:wardId', async (req, res) => {
  try {
    const { wardId } = req.params;
    console.log(wardId);
    floorNo = Math.floor(wardId / 100); 
    wardNo = wardId % 100;
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

app.get('/availableDoctorsWard', async (req, res) => {
  try {
   
    const availableDoctorsQuery = `
    SELECT D."DOCTOR_ID", D."FIRST_NAME" || ' ' || D."LAST_NAME" AS "DOCTOR_NAME"
    FROM "DOCTORS" D 
    WHERE D."DOCTOR_ID" NOT IN (SELECT A."DOCTOR_ID_DAY" FROM "WARD" A)
    AND D."DOCTOR_ID" NOT IN (SELECT B."DOCTOR_ID_NIGHT" FROM "WARD" B)
    `;
    const availableDoctorsResult = await pool.query(availableDoctorsQuery);

    
    const availableDoctors = availableDoctorsResult.rows;
    console.log("availableDoctors",availableDoctors); 
    
    res.status(200).json(availableDoctors);
    
  } catch (err) {
    console.error('Error fetching available doctors:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/patientInfoforWard/:patientId', async (req, res) => {
  const { patientId } = req.params;
  console.log("dslk",patientId);
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

app.get('/doctorRecentActivitiesInWard', async (req, res) => {
  try {
    const { doctor_id,interval } = req.query;
    console.log(req.query); 

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

app.get('/doctorRecentActivitiesInCabin', async (req, res) => {
  try {
    const { doctor_id,interval } = req.query;
    console.log(req.query); 
   
    const query = `
      SELECT * FROM getdoctoractivitiesincabin($1, $2)
    `;
    const { rows } = await pool.query(query, [doctor_id, interval]);
    console.log(rows);
    
    res.json(rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

app.get('/patientsWardHistory/:patientId', async (req, res) => {
  const { patientId } = req.params;
  console.log(patientId); 

  try {
      
      const wardHistory = await pool.query('SELECT * FROM get_ward_history($1)', [patientId]);

      
      res.status(200).json({ wardHistory });
     
  } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/patientsCabinHistory/:patientId', async (req, res) => {
  const { patientId } = req.params;
 // console.log(patientId);
  try {
   
    const cabinHistory = await pool.query('SELECT * FROM get_patient_cabin_history($1)', [patientId]);

   
    res.status(200).json({ cabinHistory });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// app.get('/patientInfoforWard/:bedId', async (req, res) => {
//   const bedId = req.params.bedId;
//   console.log(bedId);
//   try {

//       const client = await pool.connect();
//       const result = await client.query('SELECT * FROM patients WHERE bed_id = $1', [bedId]);
//       client.release();
//       if (result.rows.length > 0) {
//           res.json(result.rows[0]);
//       } else {
//           res.status(404).json({ error: 'Patient information not found for the specified bed.' });
//       }
//   } catch (error) {
//       console.error('Error fetching patient information:', error);
//       res.status(500).json({ error: 'Internal server error' });
//   }
// });

app.post('/admitPatient/:patient_id/:required_specialization', async (req, res) => {
  try {
    const { patient_id, required_specialization } = req.params;
   
    console.log(patient_id, required_specialization);
    let message = '';
    
    await pool.query('SELECT admit_patient_to_ward($1, $2) AS message', [patient_id, required_specialization], (err, result) => {
      if (err) {
        
        res.status(500).send('Internal Server Error');
      } else {
        const { message } = result.rows[0];
        console.log(message);
        res.send(message);
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/admitPatientToCabin/:patient_id/:cabinType', async (req, res) => {
  try {
    const { patient_id, cabinType } = req.params;
    console.log(patient_id, cabinType);
    
    const { rows } = await pool.query('SELECT admit_patient_to_cabin($1, $2) AS message', [patient_id, cabinType]);
    const message = rows[0].message;
    
    
    console.log(message);
    
   
    res.send(message);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/manageDoctorLeave/:doctorId', async (req, res) => {
  const { doctorId } = req.params;
  try {
    
    const result = await pool.query('SELECT * FROM manage_doctor_leave($1)', [doctorId]);
    
    const message = result.rows[0];
    console.log(message);
    res.send(message);
  } catch (error) {
    console.error('Error executing manage_doctor_leave:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/manageNurseLeave/:nurseId', async (req, res) => {
  const { nurseId } = req.params;
  try {
    
    const result = await pool.query('SELECT * FROM manage_nurse_leave($1)', [nurseId]);
   
    const message = result.rows[0];
    console.log(message);
    res.send(message);
  } catch (error) {
    console.error('Error executing manage_nurse_leave:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/rejectApplication/:leaveId', async (req, res) => {

  const { leaveId } = req.params;
  try {
    
    const result = await pool.query(`
      UPDATE "LEAVE_REQUESTS" SET "APPROVAL" = 'Rejected' WHERE "APPLICANT_ID" = $1;
    `
    , [leaveId]);
    
    const message = result.rows[0];
    console.log(message);
    res.send(message);
  } catch (error) {
    console.error('Error rejecting leave application:', error);
    res.status(500).send('An error occurred while rejecting the leave application');
  } 
});



app.post('/checkout/:cabinId', async (req, res) => {
  const { cabinId } = req.params;
  let cabinNo = cabinId % 100;
  let floorNo = Math.floor(cabinId / 100);
    console.log(cabinId);
  try {
    
    const result = await pool.query(`
      UPDATE "CABIN" SET "PATIENT_ID" = NULL WHERE "CABIN_NO" = $1 AND "FLOOR_NO" = $2;
    `
    , [cabinNo, floorNo]);
   
    const message = result.rows[0];
    console.log(message);
    res.send(message);
  } catch (error) {
    console.error('Error checking out patient:', error);
    res.status(500).send('An error occurred while checking out the patient');
  }
});

app.post('/rejection/:leaveId', async (req, res) => {
  const { leaveId } = req.params;
  try {
    
    const result = await pool.query('SELECT * FROM reject_leave($1)', [leaveId]);
    
    const message = result.rows[0];
    console.log(message);
    res.send(message);
  } catch (error) {
    console.error('Error rejecting leave application:', error);
    res.status(500).send('An error occurred while rejecting the leave application');
  }
});


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

