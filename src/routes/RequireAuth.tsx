import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

type Props = {
  token: string | null;
};

const RequireAuth: React.FC<Props> = ({ token }) => {
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default RequireAuth;
