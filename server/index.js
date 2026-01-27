import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

/* =========================
   ✅ CORS (OPEN – FINAL FIX)
   ========================= */
app.use(cors());           // 👈 THIS IS THE KEY
app.options("*", cors());  // 👈 preflight fix

app.use(express.json());

/* =========================
   ✅ MONGODB
   ========================= */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

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
app.get("/", (req, res) => {
  res.send("Attendance API Running");
});

app.post("/attendance", async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

    if (!employeeId || !date || !status) {
      return res.status(400).json({ error: "Missing fields" });
    }

    await Attendance.create({ employeeId, date, status });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   ✅ SERVER
   ========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
