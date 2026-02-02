import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

/* =========================
   ✅ CORS CONFIG (FIXED)
   ========================= */
app.use(
  cors({
    origin: "http://localhost:5173", // frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

/* =========================
   Body Parser
   ========================= */
app.use(express.json());

/* =========================
   MongoDB Connection
   ========================= */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

/* =========================
   Schema
   ========================= */
const AttendanceSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["Present", "Absent"],
  },
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);

/* =========================
   Routes
   ========================= */

// Health check
app.get("/", (req, res) => {
  res.send("✅ Attendance API Running");
});

// Mark attendance
app.post("/attendance", async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

    if (!employeeId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    await Attendance.create({
      employeeId,
      date,
      status,
    });

    res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
    });
  } catch (error) {
    console.error("Attendance error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =========================
   Server Start
   ========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
