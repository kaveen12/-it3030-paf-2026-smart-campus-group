// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResourceDashboardPage from "./pages/ResourceDashboardPage";
import AddResource from "./pages/AddResource";
import ViewResources from "./pages/ViewResources";
import EditResource from "./pages/EditResource";
import BulkInsert from "./pages/BulkInsert";
import AdminDashboard from "./pages/AdminDashboard";
import UserViewResource from "./pages/UserViewResource";
import UserDashboard from "./pages/UserDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/my-dashboard" element={<UserDashboard />} />
         <Route path="/admin" element={<UserViewResource />} />
        <Route path="/resourceDashboard" element={<ResourceDashboardPage />} />

        <Route path="/addResource" element={<AddResource />} />
        <Route path="/viewResource" element={<ViewResources />} />
        <Route path="/editResource/:id" element={<EditResource />} />
        <Route path="/bulk-insert" element={<BulkInsert />} />
      </Routes>
    </Router>
  );
}

export default App;