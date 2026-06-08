const express = require('express');
const pool = require('../db/pool');

const router = express.Router();

router.get("/receivedMessages/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
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

router.get("/sentMessages", async (req, res) => {
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

router.post("/sendMessage", async (req, res) => {
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

router.post("/deleteMessage", async (req, res) => {
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

module.exports = router;
