app.post('/remove/:id', (req, res) => {
    const employeeId = parseInt(req.params.id);
    console.log(employeeId);
    try {
      if (Math.floor(employeeId / 10000) === 1) {
        // Remove from doctor table
        const result= pool.query('DELETE FROM "DOCTORS" WHERE "DOCTOR_ID" = $1', [employeeId]);
        console.log(result);
        res.status(200).json({ message: 'Doctor removed successfully.' });
      } else if (Math.floor(employeeId/ 10000) === 3) {
        // Remove from nurse table
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