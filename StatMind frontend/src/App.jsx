// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TicketDashboard } from "./pages/TicketDashboard";
import { CreateTicket } from "./pages/CreateTicket";
import { TicketDetail } from "./pages/TicketDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/tickets" element={<TicketDashboard />} />
        <Route path="/tickets/create" element={<CreateTicket />} />
        <Route path="/tickets/:ticketId" element={<TicketDetail />} />
        <Route path="/" element={<TicketDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;