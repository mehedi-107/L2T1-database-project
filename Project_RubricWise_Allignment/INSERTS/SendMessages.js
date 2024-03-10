app.post("/sendMessage", async (req, res) => {
    try {
      const { from, to, message } = req.body;
  
      // Get the current date and time
      const currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
      const currentTime = new Date().toISOString().slice(11, 19); // HH:MM:SS format
  
      // Insert the message into the "NOTIFICATIONS" table
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