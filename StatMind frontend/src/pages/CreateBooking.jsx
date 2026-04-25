import React from "react";
import BookingForm from "../components/BookingForm";
import Navbar from "../components/AdminNavBar";

function CreateBooking() {
  return (
    <Navbar />
    <div>
      <BookingForm />
    </div>
  );
}

export default CreateBooking;