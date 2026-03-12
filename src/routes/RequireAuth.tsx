import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getToken, getCurrentUser } from "../utils/authStorage";

const RequireAuth = () => {
  const location = useLocation();

  const token = getToken();
  const user = getCurrentUser();

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default RequireAuth;
