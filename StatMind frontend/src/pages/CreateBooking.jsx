import React from "react";
import BookingForm from "../components/BookingForm";
import UserNavbar from "../components/UserNavBar";
import { useNavigate } from "react-router-dom";

function CreateBooking() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <UserNavbar />
      <main className="ml-56 mt-14 flex-1 py-8 px-6">

        {/* My Bookings button — top right */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate("/my-bookings")}
            className="flex items-center gap-2 bg-[#0f172a] hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M3 9h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M7 13h4M7 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            My Bookings
          </button>
        </div>

        <BookingForm />
      </main>
    </div>
  );
}

export default CreateBooking;