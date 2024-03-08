import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userID, password } = req.body;
    console.log(userID);
    console.log(password);
    let x = Math.floor(userID / 10000);
    console.log(x);
    
    // Determine the user type based on the value of x
    let tableName;
    switch (x) {
      case 1:
        tableName = 'DOCTORS';
        break;
      case 2:
        tableName = 'PATIENTS';
        break;
      case 3:
        tableName = 'NURSES';
        break;
      default:
        return res.status(401).json({ success: false, message: 'Invalid user ID' });
    }

    // Query the respective table for login
    const user = await pool.query(
      `SELECT * FROM "${tableName}" WHERE "${tableName.slice(0, -1)}_ID" = $1 AND "PASSWORD" = $2`,
      [userID, password]
    );

    if (user.rows.length === 0) {
      console.log('Invalid user ID or password');
      return res.status(401).json({ success: false, message: 'Invalid user ID or password' });
    }

    console.log(user.rows[0]);
    return res.status(200).json({ success: true, message: 'Login successful', user: user.rows[0] });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
