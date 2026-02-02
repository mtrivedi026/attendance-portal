import { useState } from "react";
import Attendance from "./attendance";

function App() {
  const [user, setUser] = useState<string | null>(
    localStorage.getItem("employeeId")
  );

  const handleLogin = () => {
    const employeeId = prompt("Enter Employee ID");

    if (employeeId) {
      localStorage.setItem("employeeId", employeeId);
      setUser(employeeId);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {user ? (
        <Attendance setUser={setUser} />
      ) : (
        <>
          <h2>Employee Login</h2>
          <button onClick={handleLogin}>Login</button>
        </>
      )}
    </div>
  );
}

export default App;
