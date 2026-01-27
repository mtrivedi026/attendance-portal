import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

/* =========================
   ✅ CORS CONFIG (FINAL)
   ========================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local frontend
      "https://attendance-portal-three.vercel.app" // vercel frontend
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// ✅ Preflight request fix (MOST IMPORTANT)
app.options("*", cors());

app.use(express.json());

/* =========================
   ✅ MONGODB CONNECT
   ========================= */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

/* =========================
   ✅ SCHEMA
   ========================= */
const AttendanceSchema = new mongoose.Schema({
  employeeId: String,
  date: String,
  status: String,
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);

/* =========================
   ✅ ROUTES
   ========================= */

// Root test route
app.get("/", (req, res) => {
  res.send("Attendance API Running");
});

// Attendance route
app.post("/attendance", async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

    if (!employeeId || !date || !status) {
      return res.status(400).json({ error: "Missing fields" });
    }

    await Attendance.create({ employeeId, date, status });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   ✅ SERVER START
   ========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
