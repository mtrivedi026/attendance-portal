type Props = {
  setUser: (id: null) => void;
};

function Attendance({ setUser }: Props) {
  const employeeId = localStorage.getItem("employeeId");
  const today = new Date().toLocaleDateString();

  const markAttendance = async (status: string) => {
    try {
      await fetch("http://localhost:5000/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId,
          date: today,
          status,
        }),
      });

      alert(`Attendance marked: ${status}`);
    } catch (error) {
      alert("Server not running");
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
