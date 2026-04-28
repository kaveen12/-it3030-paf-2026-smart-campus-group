import React, { useState, useEffect } from "react";
import axios from "axios";
import UserNavbar from "../components/usernav";
import { getSessionUser } from "../utils/sessionUser";

function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const sessionUser = getSessionUser();
    if (sessionUser.userId) {
      setUserId(sessionUser.userId);
      setUserName(sessionUser.userName || "");
      fetchBookings(sessionUser.userId);
    }
  }, []);

  const fetchBookings = (uid) => {
    setLoading(true);
    axios
      .get(`http://localhost:8081/api/bookings/user/${uid}`)
      .then((res) => {
        setBookings(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const counts = {
    total: bookings.length,
    approved: bookings.filter((b) => b.status?.toUpperCase() === "APPROVED").length,
    pending: bookings.filter((b) => b.status?.toUpperCase() === "PENDING").length,
    rejected: bookings.filter((b) => b.status?.toUpperCase() === "REJECTED").length,
    cancelled: bookings.filter((b) => b.status?.toUpperCase() === "CANCELLED").length,
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <UserNavbar />

      <main className="ml-56 mt-14 flex-1 py-10 px-6">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Page Title */}
          <div className="text-center mb-2">
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
            <p className="text-sm text-gray-400 mt-1">Your profile and account overview</p>
          </div>

          {/* ── Profile Card ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Banner */}
            <div className="h-24 bg-gray-900" />

            {/* Avatar + Name */}
            <div className="px-8 pb-6">
              <div className="-mt-10 mb-4">
                <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center">
                  <span className="text-2xl font-extrabold text-gray-800">
                    {getInitials(userName)}
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-extrabold text-gray-900">{userName || "—"}</h2>
              <p className="text-xs text-gray-400 mt-0.5">Registered User</p>

              <hr className="border-gray-100 my-5" />

              {/* Profile Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Full Name</p>
                    <p className="text-sm font-semibold text-gray-800">{userName || "—"}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">User ID</p>
                    <p className="text-sm font-semibold text-gray-800 break-all">{userId || "—"}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Role</p>
                    <p className="text-sm font-semibold text-gray-800">User</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100 my-5" />

              {/* Booking Stats */}
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">Booking Summary</p>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                  <p className="text-lg font-extrabold text-gray-800">{counts.total}</p>
                  <p className="text-[9px] uppercase tracking-wider text-gray-400 mt-0.5">Total</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
                  <p className="text-lg font-extrabold text-green-600">{counts.approved}</p>
                  <p className="text-[9px] uppercase tracking-wider text-green-400 mt-0.5">Approved</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
                  <p className="text-lg font-extrabold text-amber-500">{counts.pending}</p>
                  <p className="text-[9px] uppercase tracking-wider text-amber-400 mt-0.5">Pending</p>
                </div>
                <div className="bg-red-50 rounded-xl p-3 text-center border border-red-100">
                  <p className="text-lg font-extrabold text-red-500">{counts.rejected}</p>
                  <p className="text-[9px] uppercase tracking-wider text-red-400 mt-0.5">Rejected</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default UserDashboard;