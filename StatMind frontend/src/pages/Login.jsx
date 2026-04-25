import { useState } from "react";

function Login() {
  const [userId, setUserId] = useState("");

  const handleLogin = () => {
    localStorage.setItem("userId", userId);
    window.location.href = "/";
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input
          type="text"
          placeholder="Enter User ID (e.g., user1)"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;