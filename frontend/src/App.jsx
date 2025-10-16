import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ReportIssueModal from "./components/ReportIssueModal";

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="bottom-right" />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<ReportIssueModal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
