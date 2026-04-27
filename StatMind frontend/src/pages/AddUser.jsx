import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../components/AdminNavBar";

function AddUser() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8081/api/users", {
        name,
        email,
        role,
      });

      alert("User created successfully");
      navigate("/users"); // back to user management
    } catch (error) {
      console.error(error);
      alert("Failed to create user");
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen text-gray-800">
      <AdminNavBar />

      <main className="ml-56 w-full p-6 pt-20">
        <h1 className="text-3xl font-bold mb-6">Add New User</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow space-y-4 max-w-xl"
        >
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-3 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 rounded-lg"
              required
            />
          </div>

                    <div>
            <label className="block mb-1 font-medium">Email</label>
           <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border p-3 rounded-lg"
                required
            />
            
          </div>

          <div>
            <label className="block mb-1 font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border p-3 rounded-lg"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="TECHNICIAN">TECHNICIAN</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600"
            >
              Create User
            </button>

            <button
              type="button"
              onClick={() => navigate("/users")}
              className="bg-gray-300 px-5 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AddUser;