import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

/* =========================
   🔥 CORS — FINAL & SAFE
   ========================= */
app.use(cors({
  origin: "*",                 // allow all (testing)
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

// 👇 VERY IMPORTANT: preflight support
app.options("*", cors());

// body parser (AFTER cors)
app.use(express.json());

/* =========================
   MongoDB
   ========================= */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

/* =========================
   Schema
   ========================= */
const AttendanceSchema = new mongoose.Schema({
  employeeId: String,
  date: String,
  status: String,
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);

/* =========================
   Routes
   ========================= */
app.get("/", (req, res) => {
  res.send("Attendance API Running");
});

app.post("/attendance", async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

    await Attendance.create({ employeeId, date, status });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   Server
   ========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
