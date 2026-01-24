const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Attendance = require("./models/Attendance");

const app = express();

/* ======================
   MIDDLEWARE
====================== */
app.use(cors());
app.use(express.json());

/* ======================
   MONGODB CONNECTION
====================== */
mongoose
  .connect("mongodb://127.0.0.1:27017/attendance")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Mongo Error:", err));

/* ======================
   TEST ROUTE
====================== */
app.get("/", (req, res) => {
  res.send("Attendance Server Running");
});

/* ======================
   POST ATTENDANCE
   (NAME + DATE UNIQUE)
====================== */
app.post("/attendance", async (req, res) => {
  try {
    const { employeeName, status, date } = req.body;

    const record = new Attendance({
      employeeName,
      status,
      date
    });

    await record.save();

    res.status(201).json({ message: "Attendance saved" });

  } catch (error) {
    // Duplicate name + date
    if (error.code === 11000) {
      return res.status(400).json({
        message: "❌ Attendance already marked for this date"
      });
    }

    res.status(500).json({
      message: "Server error",
      error
    });
  }
});

/* ======================
   GET ALL ATTENDANCE
====================== */
app.get("/attendance", async (req, res) => {
  try {
    const data = await Attendance.find().sort({ date: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

/* ======================
   MONTHLY REPORT
   (PRESENT COUNT)
====================== */
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
    res.status(500).json({ message: "Server error", error });
  }
});

/* ======================
   SERVER START
====================== */
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
