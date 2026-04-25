import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";
import { UserLayout } from "./components/UserLayout";
import { TicketDashboard } from "./pages/TicketDashboard";
import { CreateTicket } from "./pages/CreateTicket";
import { TicketDetail } from "./pages/TicketDetail";

function App() {
  return (
    <Router>
      <Routes>
        {/* USER ROUTES */}
        <Route
          path="/user/tickets"
          element={
            <UserLayout>
              <CreateTicket />
            </UserLayout>
          }
        />

        <Route
          path="/user/tickets/create"
          element={
            <UserLayout>
              <CreateTicket />
            </UserLayout>
          }
        />

        <Route
          path="/user/tickets/:ticketId"
          element={
            <UserLayout>
              <TicketDetail />
            </UserLayout>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin/tickets"
          element={
            <AdminLayout>
              <TicketDashboard />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/tickets/:ticketId"
          element={
            <AdminLayout>
              <TicketDetail />
            </AdminLayout>
          }
        />

        {/* DEFAULT */}
        <Route
          path="/"
          element={
            <UserLayout>
              <CreateTicket />
            </UserLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;