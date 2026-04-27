import { useEffect, useState } from "react";
import axios from "axios";

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
      console.error(error);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:8081/api/users", {
      name,
      email,
      role,
    });

    setName("");
    setEmail("");
    setRole("USER");
    fetchUsers();
  };

  const updateRole = async (id, newRole) => {
    await axios.put(
      `http://localhost:8081/api/users/${id}/role?role=${newRole}&currentUserRole=ADMIN`
    );
    fetchUsers();
  };

  return (
    <div className="p-6 pt-16 bg-slate-900 min-h-screen text-white">

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-6">
        Manage Users & Roles
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Total Users</p>
          <h2 className="text-2xl font-bold">{users.length}</h2>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Admins</p>
          <h2 className="text-2xl font-bold">
            {users.filter(u => u.role === "ADMIN").length}
          </h2>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Users</p>
          <h2 className="text-2xl font-bold">
            {users.filter(u => u.role === "USER").length}
          </h2>
        </div>
      </div>

      {/* CREATE USER */}
      <form
        onSubmit={createUser}
        className="bg-slate-800 p-4 rounded-lg mb-6 flex gap-3"
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-slate-700 p-2 rounded w-full"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-slate-700 p-2 rounded w-full"
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="bg-slate-700 p-2 rounded"
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="TECHNICIAN">TECHNICIAN</option>
        </select>

        <button className="bg-green-500 px-4 rounded hover:bg-green-600">
          + Add
        </button>
      </form>

      {/* TABLE */}
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-700">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Change Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-slate-700">
                <td className="p-3">{user.name}</td>
                <td className="p-3 text-gray-400">{user.email}</td>

                {/* ROLE BADGE */}
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded text-xs ${
                      user.role === "ADMIN"
                        ? "bg-green-600"
                        : user.role === "TECHNICIAN"
                        ? "bg-yellow-600"
                        : "bg-blue-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                {/* CHANGE ROLE */}
                <td className="p-3">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      updateRole(user.id, e.target.value)
                    }
                    className="bg-slate-700 p-2 rounded"
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
          <p className="p-4 text-gray-400">No users found</p>
        )}
      </div>
    </div>
  );
}

export default UserManagement;