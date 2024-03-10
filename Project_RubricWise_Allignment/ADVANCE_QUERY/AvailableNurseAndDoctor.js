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
    } catch (err) {
      console.error('Error fetching available nurses:', err);
      res.status(500).json({ error: 'Internal Server Error' });
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