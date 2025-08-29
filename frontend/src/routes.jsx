import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Login from "./Login";
import Dashboard from "./Dashboard";
import PrivateRoute from "./PrivateRoute";
import Navbar from "./Navbar";
import Navbar1 from "./Navbar1";
import ClientLogin from "./ClientLogin";
import ClientSignup from "./ClientSignup";
export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Client Home with Navbar1 */}
        <Route path="/" element={
          <>
            <Navbar1 />
            <App />
          </>
        } />
        {/* Client Login and Signup */}
        <Route path="/login" element={<><Navbar1 /><ClientLogin /></>} />
        <Route path="/signup" element={<><Navbar1 /><ClientSignup /></>} />
        {/* Admin/Dashboard routes with admin Navbar */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Navbar />
            <Dashboard />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}
