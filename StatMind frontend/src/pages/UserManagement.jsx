import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavBar from "../components/AdminNavBar";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

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
  const [editingUser, setEditingUser] = useState(null);

  const deleteUser = async (id) => {
  if (!window.confirm("Are you sure to delete?")) return;

  await axios.delete(`http://localhost:8081/api/users/${id}`);
  fetchUsers();
};
const updateUser = async () => {
  await axios.put(
    `http://localhost:8081/api/users/${editingUser.id}`,
    {
      name: editingUser.name,
      email: editingUser.email,
    }
  );

  setEditingUser(null);
  fetchUsers();
};

  return (
    <div className="flex bg-gray-100 min-h-screen text-gray-800">
      <AdminNavBar />

      <main className="ml-56 w-full p-6 pt-20">
        
        {/* HEADER + BUTTON */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Manage Users & Roles
          </h1>

          <button
            onClick={() => navigate("/add-user")}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            + Add User
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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

          <div className="bg-white p-5 rounded-xl shadow border">
  <p className="text-sm text-gray-500">Technicians</p>
  <h2 className="text-3xl font-bold mt-2">
    {users.filter((u) => u.role === "TECHNICIAN").length}
  </h2>
</div>
        </div>

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
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      {user.name?.charAt(0).toUpperCase() || "U"}
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

                  <td className="p-4 flex gap-2">
                  <button
                   onClick={() => setEditingUser(user)}
                     className="bg-yellow-400 px-3 py-1 rounded text-white hover:bg-yellow-500"
                   >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {editingUser && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
    <div className="bg-white p-6 rounded-xl w-96">
      <h2 className="text-lg font-bold mb-4">Edit User</h2>

      <input
        type="text"
        value={editingUser.name}
        onChange={(e) =>
          setEditingUser({ ...editingUser, name: e.target.value })
        }
        className="w-full border p-2 mb-3 rounded"
      />

      <input
        type="email"
        value={editingUser.email}
        onChange={(e) =>
          setEditingUser({ ...editingUser, email: e.target.value })
        }
        className="w-full border p-2 mb-3 rounded"
      />

      <div className="flex gap-2">
        <button
          onClick={updateUser}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>

        <button
          onClick={() => setEditingUser(null)}
          className="bg-gray-400 px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

          {users.length === 0 && (
            <p className="p-6 text-gray-500">No users found</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserManagement;