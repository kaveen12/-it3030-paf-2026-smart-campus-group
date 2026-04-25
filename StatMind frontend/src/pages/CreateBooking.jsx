import React from "react";
import BookingForm from "../components/BookingForm";
import UserNavbar from "../components/UserNavBar";

function CreateBooking() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <UserNavbar />
      <main className="ml-56 mt-14 flex-1 py-8 px-6">
        <BookingForm />
      </main>
    </div>
  );
}

export default CreateBooking;