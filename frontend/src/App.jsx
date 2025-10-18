import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/Admin";
import ReportIssueModal from "./components/ReportIssueModal";
import IssueDetail from "./pages/IssueDetails";

function App() {
  return (
    <BrowserRouter basename="/">
      <Toaster richColors position="bottom-right" />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-dashboard/issues" element={<IssueDetail />} />
        <Route path="/create" element={<ReportIssueModal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
