const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employeeName: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["Present", "Absent"],
      required: true
    },
    date: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// ✅ SAME NAME + SAME DATE DUPLICATE BLOCK
attendanceSchema.index(
  { employeeName: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
