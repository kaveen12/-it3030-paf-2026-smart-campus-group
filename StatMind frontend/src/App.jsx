import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";
import { UserLayout } from "./components/UserLayout";

import { TicketDashboard } from "./pages/TicketDashboard";
import { TicketDetail } from "./pages/TicketDetail";
import { CreateTicket } from "./pages/CreateTicket";

import { UserTicketHome } from "./pages/UserTicketHome";
import { UserTickets } from "./pages/UserTickets";
import { UserTicketDetail } from "./pages/UserTicketDetail";

import { TechnicianLayout } from "./components/TechnicianLayout";
import { TechnicianTickets } from "./pages/TechnicianTickets";
import { TechnicianTicketDetail } from "./pages/TechnicianTicketDetail";

function App() {
  return (
    <Router>
      <Routes>

        {/* USER */}
        <Route path="/user/tickets" element={<UserLayout><UserTicketHome /></UserLayout>} />
        <Route path="/user/tickets/create" element={<UserLayout><CreateTicket /></UserLayout>} />
        <Route path="/user/tickets/list" element={<UserLayout><UserTickets /></UserLayout>} />
        <Route path="/user/tickets/:ticketId" element={<UserLayout><UserTicketDetail /></UserLayout>} />

        {/* ADMIN */}
        <Route path="/admin/tickets" element={<AdminLayout><TicketDashboard /></AdminLayout>} />
        <Route path="/admin/tickets/:ticketId" element={<AdminLayout><TicketDetail /></AdminLayout>} />

        <Route
  path="/technician/tickets"
  element={
    <TechnicianLayout>
      <TechnicianTickets />
    </TechnicianLayout>
  }
/>

<Route
  path="/technician/tickets/:ticketId"
  element={
    <TechnicianLayout>
      <TechnicianTicketDetail />
    </TechnicianLayout>
  }
/>

        {/* DEFAULT */}
        <Route
  path="/"
  element={
    <UserLayout>
      <UserTicketHome />
    </UserLayout>
  }
/>
      </Routes>
    </Router>
  );
}

export default App;