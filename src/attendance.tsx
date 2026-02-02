fetch("https://attendance-backend-2yve.onrender.com/attendance", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    employeeId,
    date,
    status,
  }),
});
