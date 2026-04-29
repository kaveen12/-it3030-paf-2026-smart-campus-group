import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavBar from "../components/adminnav";

function Profile() {
  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:8081/api/users`);
      const currentUser = res.data.find((u) => u.id === userId);
      setUser({
        name: currentUser.name,
        email: currentUser.email,
        password: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.put(
        `http://localhost:8081/api/users/${userId}/profile`,
        user
      );

      alert("Profile updated successfully");

      // update localStorage name
      localStorage.setItem("name", user.name);

    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminNavBar />

      <main className="ml-56 w-full p-8 pt-20">
        <div className="max-w-2xl mx-auto">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-800 text-white p-6 rounded-2xl shadow mb-6">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-blue-100 mt-1">
              View and update your account details
            </p>
          </div>

          {/* CARD */}
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded-2xl shadow border space-y-5"
          >

            {/* NAME */}
            <div>
              <label className="block mb-2 font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            {/* EMAIL (DISABLED) */}
            <div>
              <label className="block mb-2 font-semibold">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full border p-3 rounded-lg bg-gray-100 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block mb-2 font-semibold">
                New Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter new password (optional)"
                value={user.password}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* BUTTON */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default Profile;