const express = require('express');
const pool = require('../db/pool');

const router = express.Router();

const loginTargets = {
  1: { table: 'DOCTORS', idColumn: 'DOCTOR_ID' },
  2: { table: 'PATIENTS', idColumn: 'PATIENT_ID' },
  3: { table: 'NURSES', idColumn: 'NURSE_ID' },
};

const passwordTargets = {
  doctor: loginTargets[1],
  patient: loginTargets[2],
  nurse: loginTargets[3],
};

router.post('/login', async (req, res) => {
  try {
    const { userID, password } = req.body;

    if (!userID || !password) {
      return res.status(400).json({ success: false, message: 'User ID and password are required' });
    }

    const userGroup = Math.floor(Number(userID) / 10000);
    const target = loginTargets[userGroup];

    if (!target) {
      return res.status(401).json({ success: false, message: 'Invalid user ID or password' });
    }

    const { rows } = await pool.query(
      `SELECT * FROM "${target.table}" WHERE "${target.idColumn}" = $1 AND "PASSWORD" = $2`,
      [userID, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid user ID or password' });
    }

    return res.status(200).json({ success: true, message: 'Login successful', user: rows[0] });
  } catch (error) {
    console.error('Login failed:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/changePassword/:userID/:currentPassword/:newPassword/:userType', async (req, res) => {
  try {
    const { userID, currentPassword, newPassword, userType } = req.params;
    const target = passwordTargets[userType];

    if (!target) {
      return res.status(400).json({ success: false, message: 'Invalid user type.' });
    }

    const user = await pool.query(
      `SELECT * FROM "${target.table}" WHERE "${target.idColumn}" = $1 AND "PASSWORD" = $2`,
      [userID, currentPassword]
    );

    if (user.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Password changed successfully',
        triggerMessage: 'Invalid current password',
      });
    }

    await pool.query(`UPDATE "${target.table}" SET "PASSWORD" = $1 WHERE "${target.idColumn}" = $2`, [
      newPassword,
      userID,
    ]);

    const triggerMsg = await pool.query('SELECT "message" FROM "TRIGGER_MESSAGES" ORDER BY "id" DESC LIMIT 1');
    const message = triggerMsg.rows[0]?.message || 'Password changed successfully';

    return res.status(200).json({ success: true, message: 'Password changed successfully', triggerMessage: message });
  } catch (error) {
    console.error('Password change failed:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
