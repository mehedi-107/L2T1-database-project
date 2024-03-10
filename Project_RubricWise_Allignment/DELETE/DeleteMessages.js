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
  