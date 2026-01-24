const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Attendance = require("./models/Attendance");

const app = express();

/* =======================
   MIDDLEWARES
======================= */
app.use(cors());
app.use(express.json());

/* =======================
   ROOT ROUTE (IMPORTANT)
======================= */
app.get("/", (req, res) => {
  res.send("Attendance Server Running");
});

/* =======================
   POST ATTENDANCE
   (Duplicate block handled by Mongo unique index)
======================= */
app.post("/attendance", async (req, res) => {
  try {
    const { employeeName, status, date } = req.body;

    if (!employeeName || !status || !date) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const record = new Attendance({
      employeeName,
      status,
      date
    });

    await record.save();

    res.status(201).json({
      message: "✅ Attendance saved"
    });

  } catch (error) {
    // Duplicate entry error
    if (error.code === 11000) {
      return res.status(400).json({
        message: "❌ Attendance already marked for this date"
      });
    }

    console.error(error);
    res.status(500).json({
      message: "❌ Server error"
    });
  }
});

/* =======================
   GET ALL ATTENDANCE
======================= */
app.get("/attendance", async (req, res) => {
  try {
    const data = await Attendance.find().sort({ date: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =======================
   MONTHLY REPORT
======================= */
app.get("/report/:month", async (req, res) => {
  try {
    const month = req.params.month; // YYYY-MM

    const report = await Attendance.aggregate([
      {
        $match: {
          date: { $regex: `^${month}` },
          status: "Present"
        }
      },
      {
        $group: {
          _id: "$employeeName",
          totalPresent: { $sum: 1 }
        }
      }
    ]);

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =======================
   DATABASE + SERVER START
======================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
