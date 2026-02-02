type Props = {
  setUser: (id: null) => void;
};

function Attendance({ setUser }: Props) {
  const employeeId = localStorage.getItem("employeeId");
  const today = new Date().toISOString().split("T")[0];

  const markAttendance = async (status: string) => {
    try {
      const response = await fetch(
        "https://attendance-backend-29ve.onrender.com/attendance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeId,
            date: today,
            status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Request failed");
      }

      alert(`Attendance marked: ${status} ✅`);
    } catch (error) {
      console.error(error);
      alert("Server error ❌");
    }
  };

  return (
    <div className="container">
      <h2>Shivaanya Realcon Pvt. Ltd.</h2>
      <h3>Employee: {employeeId}</h3>
      <p>Date: {today}</p>

      <button onClick={() => markAttendance("Present")}>
        Present
      </button>

      <button onClick={() => markAttendance("Absent")}>
        Absent
      </button>

      <br /><br />

      <button
        onClick={() => {
          localStorage.removeItem("employeeId");
          setUser(null);
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Attendance;
