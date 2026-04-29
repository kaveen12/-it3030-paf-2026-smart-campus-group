import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../components/adminnav";

function AddUser() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});

  // 🔥 Validation function
  const validate = () => {
    let newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return; // ❌ stop if invalid

    try {
      await axios.post("http://localhost:8081/api/users", {
        name,
        email,
        password,
        role,
      });

      alert("User created successfully");
      navigate("/users");
    } catch (error) {
      console.error(error);
      alert("Failed to create user");
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen text-gray-800">
      <AdminNavBar />

      <main className="ml-56 w-full p-6 pt-20">
        <div className="max-w-3xl mx-auto">

          {/* HEADER */}
          <div className="mb-6">
            <p className="text-sm text-blue-600 font-semibold">
              User Management
            </p>
            <h1 className="text-3xl font-bold text-gray-900">
              Add New User
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg border overflow-hidden"
          >

            {/* TOP HEADER */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <h2 className="text-xl font-bold">Account Details</h2>
            </div>

            {/* FORM */}
            <div className="p-6 space-y-5">

              {/* NAME */}
              <div>
                <label className="block mb-2 text-sm font-semibold">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full p-3 rounded-xl border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <label className="block mb-2 text-sm font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-3 rounded-xl border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block mb-2 text-sm font-semibold">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full p-3 rounded-xl border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* ROLE */}
              <div>
                <label className="block mb-2 text-sm font-semibold">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="TECHNICIAN">TECHNICIAN</option>
                </select>
              </div>

            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 bg-gray-50 px-6 py-4 border-t">
              <button
                type="button"
                onClick={() => navigate("/users")}
                className="px-5 py-2 rounded-xl border hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              >
                Create User
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default AddUser;