import { useState } from "react";

function Login() {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("USER");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!userId.trim()) {
      alert("Please enter a user ID");
      return;
    }

    localStorage.setItem("userId", userId);
    localStorage.setItem("role", role);

    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">StatMind</h1>
          <p className="text-gray-500 mt-2">
            Smart Campus Operations Hub
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User ID
            </label>
            <input
              type="text"
              placeholder="Example: user1"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Login Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="TECHNICIAN">TECHNICIAN</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            className="w-full border border-gray-300 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition"
            onClick={() => alert("Google OAuth can be integrated here")}
          >
            Continue with Google
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          This login simulates OAuth user access for demo purposes.
        </p>
      </div>
    </div>
  );
}

export default Login;