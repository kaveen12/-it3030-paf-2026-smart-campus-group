// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AddResource from "./pages/AddResource";
import ViewResources from "./pages/ViewResources";
import EditResource from "./pages/EditResource";

function App() {
  return (
    <Router>
      <div className="flex">
        <Navbar />
        <div className="ml-64 flex-1 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddResource />} />
            <Route path="/view" element={<ViewResources />} />
            <Route path="/edit/:id" element={<EditResource />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;