import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getToken } from "../utils/authStorage";

const RequireAuth: React.FC = () => {
  const location = useLocation();
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default RequireAuth;
