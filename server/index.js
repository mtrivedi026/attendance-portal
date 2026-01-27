import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const AttendanceSchema = new mongoose.Schema({
  name: String,
  status: String,
  date: String,
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);

app.post("/attendance", async (req, res) => {
  try {
    const { name, status, date } = req.body;
    await Attendance.create({ name, status, date });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/", (req, res) => {
  res.send("Attendance API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
