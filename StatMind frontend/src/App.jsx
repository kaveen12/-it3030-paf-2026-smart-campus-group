// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResourceDashboardPage from "./pages/ResourceDashboardPage";
import AddResource from "./pages/AddResource";
import ViewResources from "./pages/ViewResources";
import EditResource from "./pages/EditResource";
import BulkInsert from "./pages/BulkInsert";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ResourceDashboardPage />} />
        <Route path="/add" element={<AddResource />} />
        <Route path="/view" element={<ViewResources />} />
        <Route path="/edit/:id" element={<EditResource />} />
        <Route path="/bulk-insert" element={<BulkInsert />} />
      </Routes>
    </Router>
  );
}

export default App;