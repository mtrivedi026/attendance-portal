import { useState } from "react";

type Props = {
  setUser: (id: string) => void;
};

function Login({ setUser }: Props) {
  const [employeeId, setEmployeeId] = useState("");

  const handleLogin = () => {
    if (!employeeId.trim()) {
      alert("Please enter Employee ID");
      return;
    }

    localStorage.setItem("employeeId", employeeId);
    setUser(employeeId);
  };

  return (
    <div className="container">
      <h2>Shivaanya Realcon Pvt. Ltd.</h2>
      <h3>Employee Login</h3>

      <input
        type="text"
        placeholder="Enter Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
