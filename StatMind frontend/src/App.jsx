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
import BookingListPage from "./pages/BookingListPage";

import UserBookings from "./pages/UserBookings";
import UniversityHomePage from "./pages/Home";
import AdminSendNotification from "./pages/AdminSendNotification";
import AddUser from "./pages/AddUser";

import AdminLayout from "./components/AdminLayout";
import UserLayout from "./components/UserLayout";
import TechnicianLayout from "./components/TechnicianLayout";

import TicketDashboard from "./pages/TicketDashboard";
import TicketDetail from "./pages/TicketDetail";
import CreateTicket from "./pages/CreateTicket";

import UserTicketHome from "./pages/UserTicketHome";
import UserTickets from "./pages/UserTickets";
import UserTicketDetail from "./pages/UserTicketDetail";

import TechnicianTickets from "./pages/TechnicianTickets";
import TechnicianTicketDetail from "./pages/TechnicianTicketDetail";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UniversityHomePage />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add-user" element={<AddUser />} />

        {/* DASHBOARDS */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/resources" element={<UserViewResource />} />
        <Route path="/resourceDashboard" element={<ResourceDashboardPage />} />
        <Route path="/addResource" element={<AddResource />} />
        <Route path="/viewResource" element={<ViewResources />} />
        <Route path="/editResource/:id" element={<EditResource />} />
        <Route path="/bulk-insert" element={<BulkInsert />} />
        <Route path="/send-notification" element={<AdminSendNotification />} />

        <Route path="/Bookings" element={<BookingListPage />} />
        <Route path="/create-booking" element={<CreateBooking />} />
        <Route path="/my-bookings" element={<UserBookings />} />

        {/* USER TICKETS */}
        <Route path="/user/tickets" element={<UserLayout><UserTicketHome /></UserLayout>} />
        <Route path="/user/tickets/create" element={<UserLayout><CreateTicket /></UserLayout>} />
        <Route path="/user/tickets/list" element={<UserLayout><UserTickets /></UserLayout>} />
        <Route path="/user/tickets/:ticketId" element={<UserLayout><UserTicketDetail /></UserLayout>} />

        {/* ADMIN TICKETS */}
        <Route path="/admin/tickets" element={<AdminLayout><TicketDashboard /></AdminLayout>} />
        <Route path="/admin/tickets/:ticketId" element={<AdminLayout><TicketDetail /></AdminLayout>} />

        {/* TECHNICIAN TICKETS */}
        <Route path="/technician/tickets" element={<TechnicianLayout><TechnicianTickets /></TechnicianLayout>} />
        <Route path="/technician/tickets/:ticketId" element={<TechnicianLayout><TechnicianTicketDetail /></TechnicianLayout>} />


      </Routes>
    </Router>
  );
}

export default App;