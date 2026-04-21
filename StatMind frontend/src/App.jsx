// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CreateBooking from "./pages/CreateBooking";
import BookingListPage  from "./pages/BookingListPage";

function App() {
  return (
    <Router>
      <div className="flex">
        <Navbar />
        <div className="ml-64 flex-1 p-6">
          <Routes>
            <Route path="/" element={<BookingListPage  />} />
            <Route path="/create" element={<CreateBooking />} />
            <Route path="*" element={<BookingListPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;