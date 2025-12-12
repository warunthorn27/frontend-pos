import React from "react";
import { Navigate } from "react-router-dom";
import type { AuthUser } from "../types/auth";

type Props = {
  user: AuthUser | null;
  children: React.ReactNode;
};

const RequireRole: React.FC<Props> = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "Admin")
    return <Navigate to="/dashboard/product/product-master" replace />;

  return <>{children}</>;
};

export default RequireRole;
