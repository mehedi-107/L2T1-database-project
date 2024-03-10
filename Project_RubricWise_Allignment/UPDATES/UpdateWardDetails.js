pp.put('/updateWardDetails/:wardNo', async (req, res) => {
    const wardNo = req.params.wardNo;
    console.log(wardNo);
    const updatedDetails = req.body; // Contains the updated ward details
  
    try {
      // Perform any necessary validation here
      ward = wardNo % 100;
      floor = Math.floor(wardNo / 100);
      // For example, you can check if the doctor IDs for day and night shifts are different
      if (updatedDetails.DOCTOR_ID_DAY === updatedDetails.DOCTOR_ID_NIGHT) {
        return res.status(400).json({ error: 'Doctor IDs for day and night shifts should be different' });
      }
      
      // Update the ward details in the database
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
  
      // Respond with success message
      res.status(200).json({ message: 'Ward details updated successfully' });
    } catch (error) {
      console.error('Error updating ward details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });