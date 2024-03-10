app.put('/updateCabinDetails/:cabinId', async (req, res) => {
    const cabinId = req.params.cabinId;
  
    const updatedDetails = req.body; // Contains the updated cabin details
    console.log(cabinId, updatedDetails);
    try {
      // Perform any necessary validation here
  
      // For example, you can check if the doctor IDs for day and night shifts are different
      if (updatedDetails.DOCTOR_ID_DAY === updatedDetails.DOCTOR_ID_NIGHT) {
        return res.status(400).json({ error: 'Doctor IDs for day and night shifts should be different' });
      }
      floorNo = Math.floor(cabinId / 100);
      cabinNo = cabinId % 100;
      //Update the cabin details in the database
      const updateQuery = `
        UPDATE "CABIN"
        SET "DOCTOR_ID_DAY" = $1, "DOCTOR_ID_NIGHT" = $2, "NURSE_ID_1" = $3, "NURSE_ID_2" = $4
        WHERE "CABIN_NO" = $5 AND "FLOOR_NO" = $6
      `;
      const { DOCTOR_ID_DAY, DOCTOR_ID_NIGHT, NURSE_ID_1, NURSE_ID_2 } = updatedDetails;
      
      await pool.query(updateQuery, [DOCTOR_ID_DAY, DOCTOR_ID_NIGHT, NURSE_ID_1, NURSE_ID_2, cabinNo, floorNo]);
      //console.log("Updated cabin details: ", updatedDetails);
      //console.log(updatedDetails);
      // Respond with success message
      //send index 0 if successful
      res.status(200).json({ message: 'Cabin details updated successfully' });
    } catch (error) {
      console.error('Error updating cabin details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });