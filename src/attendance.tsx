import React from "react";

type AttendanceProps = {
  setUser: React.Dispatch<React.SetStateAction<string | null>>;
};

const Attendance: React.FC<AttendanceProps> = ({ setUser }) => {
  const employeeId = localStorage.getItem("employeeId");
  const date = new Date().toISOString().split("T")[0];

  const API_URL = "https://attendance-backend-v2-6jvl.onrender.com";

  const markAttendance = async (status: "Present" | "Absent") => {
    try {
      const res = await fetch(`${API_URL}/attendance`, {
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

      if (!res.ok) {
        throw new Error("Server error");
      }

      alert(`Attendance marked as ${status} ✅`);
    } catch (error) {
      console.error("Attendance error:", error);
      alert("Server error ❌");
    }
  };

  const logout = () => {
    localStorage.removeItem("employeeId");
    setUser(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Shivaanya Realcon Pvt. Ltd.</h2>

      <p>
        <strong>Employee:</strong> {employeeId}
      </p>
      <p>
        <strong>Date:</strong> {date}
      </p>

      <div style={{ marginTop: "15px" }}>
        <button onClick={() => markAttendance("Present")}>
          Present
        </button>

        <button
          style={{ marginLeft: "10px" }}
          onClick={() => markAttendance("Absent")}
        >
          Absent
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Attendance;
