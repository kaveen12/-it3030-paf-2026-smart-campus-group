// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ResourceDashboardPage from "./pages/ResourceDashboardPage";
import AddResource from "./pages/AddResource";
import ViewResources from "./pages/ViewResources";
import EditResource from "./pages/EditResource";
import BulkInsert from "./pages/BulkInsert";


function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Navbar />
        <div style={{ marginLeft: '60px', flex: 1, paddingTop: '64px', backgroundColor: 'white' }}>
          <Routes>
            <Route path="/" element={<ResourceDashboardPage />} />
            <Route path="/add" element={<AddResource />} />
            <Route path="/view" element={<ViewResources />} />
            <Route path="/edit/:id" element={<EditResource />} />
            <Route path="/bulk-insert" element={<BulkInsert />} />
            
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;