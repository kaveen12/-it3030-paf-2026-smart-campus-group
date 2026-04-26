// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Notifications from "./pages/Notifications";
import UserManagement from "./pages/UserManagement";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function AppRoutes() {
  const location = useLocation();
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/";
  const routes = (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );

  if (isAuthRoute) {
    return <div className="auth-shell">{routes}</div>;
  }

  return (
    <div className="flex">
      <Navbar />
      <div className="ml-64 flex-1 p-6">{routes}</div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
