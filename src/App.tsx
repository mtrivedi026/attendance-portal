import { useState } from "react";
import type { FormEvent } from "react";


type AttendanceResponse = {
  message: string;
};

function App() {
  const [employeeName, setEmployeeName] = useState<string>("");
  const [status, setStatus] = useState<string>("Present");
  const [date, setDate] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          employeeName,
          status,
          date
        })
      });

      const data: AttendanceResponse = await response.json();
      setMessage(data.message);

      // reset form
      setEmployeeName("");
      setStatus("Present");
      setDate("");
    } catch (error) {
      setMessage("❌ Server error");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Daily Attendance</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Employee Name"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          required
        />

        <br /><br />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>

        <br /><br />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">Submit Attendance</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
