import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const storedData = localStorage.getItem("userInfo");
  let userInfo = null;

  try {
    userInfo = JSON.parse(storedData);
  } catch {
    userInfo = null;
  }

  if (!userInfo || !userInfo?.user) {
    // User not logged in or corrupted data
    return <Navigate to="/login" replace />;
  }

  if (role && userInfo?.user?.role !== role) {
    // Unauthorized role
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
