// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResourceDashboardPage from "./pages/ResourceDashboardPage";
import Notifications from "./pages/Notifications";
import UserManagement from "./pages/UserManagement";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddResource from "./pages/AddResource";
import ViewResources from "./pages/ViewResources";
import EditResource from "./pages/EditResource";
import BulkInsert from "./pages/BulkInsert";
import AdminDashboard from "./pages/AdminDashboard";
import UserViewResource from "./pages/UserViewResource";
import UserDashboard from "./pages/UserDashboard";
import CreateBooking from "./pages/CreateBooking";
import BookingListPage  from "./pages/BookingListPage";
import UserBookings from "./pages/UserBookings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="user/dashboard" element={<UserDashboard />} />
         <Route path="/resources" element={<UserViewResource />} />
        <Route path="/resourceDashboard" element={<ResourceDashboardPage />} />

        <Route path="/addResource" element={<AddResource />} />
        <Route path="/viewResource" element={<ViewResources />} />
        <Route path="/editResource/:id" element={<EditResource />} />
        <Route path="/bulk-insert" element={<BulkInsert />} />

        <Route path="/Bookings" element={<BookingListPage  />} />
            <Route path="/create-booking" element={<CreateBooking />} />
            <Route path="/my-bookings" element={<UserBookings />} />
      </Routes>
    </Router>
  );
}

export default App;