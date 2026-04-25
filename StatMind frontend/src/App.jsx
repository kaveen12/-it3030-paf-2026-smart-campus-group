// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateBooking from "./pages/CreateBooking";
import BookingListPage  from "./pages/BookingListPage";
import UserBookings from "./pages/UserBookings";
function App() {
  return (
    <Router>
          <Routes>
            <Route path="/" element={<BookingListPage  />} />
            <Route path="/create" element={<CreateBooking />} />
            <Route path="/my-bookings" element={<UserBookings />} />
            <Route path="*" element={<BookingListPage />} />
          </Routes>
    </Router>
  );
}

export default App;