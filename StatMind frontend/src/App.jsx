// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Notifications from "./pages/Notifications";
import UserManagement from "./pages/UserManagement";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <div className="flex">
        <Navbar />
        <div className="ml-64 flex-1 p-6">
          <Routes>
            
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;