import React from "react";
import SideBar from "../components/Admin/SideBar";
import AdminDashboard from "../components/Admin/AdminDashboard";

const Admin = () => {
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display">
      <SideBar />
      <main className="flex-1 p-6 lg:p-8">
        <AdminDashboard />
      </main>
    </div>
  );
};

export default Admin;
