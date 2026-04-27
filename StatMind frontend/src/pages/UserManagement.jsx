import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavBar from "../components/AdminNavBar";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8081/api/users", {
        name,
        email,
        role,
      });

      setName("");
      setEmail("");
      setRole("USER");
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user");
    }
  };

  const updateRole = async (id, newRole) => {
    try {
      await axios.put(
        `http://localhost:8081/api/users/${id}/role?role=${newRole}`
      );
      fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role");
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen text-gray-800">
      <AdminNavBar />

      <main className="ml-56 w-full p-6 pt-20">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Manage Users & Roles
        </h1>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-5 rounded-xl shadow border">
            <p className="text-sm text-gray-500">Total Users</p>
            <h2 className="text-3xl font-bold mt-2">{users.length}</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow border">
            <p className="text-sm text-gray-500">Admins</p>
            <h2 className="text-3xl font-bold mt-2">
              {users.filter((u) => u.role === "ADMIN").length}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow border">
            <p className="text-sm text-gray-500">Users</p>
            <h2 className="text-3xl font-bold mt-2">
              {users.filter((u) => u.role === "USER").length}
            </h2>
          </div>
        </div>

        {/* CREATE USER */}
        <form
          onSubmit={createUser}
          className="bg-white p-5 rounded-xl shadow mb-6 space-y-4"
        >
          <h2 className="text-lg font-semibold">Create New User</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border p-3 rounded-lg"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="TECHNICIAN">TECHNICIAN</option>
            </select>

            <button
              type="submit"
              className="bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
            >
              + Add User
            </button>
          </div>
        </form>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="flex justify-between items-center p-5 border-b">
            <div>
              <h2 className="text-lg font-semibold">Registered Users</h2>
              <p className="text-sm text-gray-500">
                Manage users and roles
              </p>
            </div>

            <button
              onClick={fetchUsers}
              className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Refresh
            </button>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Change Role</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-500">
                        ID: {user.id}
                      </p>
                    </div>
                  </td>

                  <td className="p-4">{user.email}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "ADMIN"
                          ? "bg-green-100 text-green-700"
                          : user.role === "TECHNICIAN"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        updateRole(user.id, e.target.value)
                      }
                      className="border p-2 rounded"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="TECHNICIAN">TECHNICIAN</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className="p-6 text-gray-500">No users found</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserManagement;