import { Navigate, useOutletContext } from "react-router-dom";
import CompanyProfilePage from "../features/company/CompanyProfilePage";
import type { DashboardOutletContext } from "../layouts/DashboardLayout";

const RequireCompany: React.FC = () => {
  const { mustCreateCompany, onCompanyCreated, currentUser } =
    useOutletContext<DashboardOutletContext>();

  if (!currentUser) {
    return <div className="p-6 text-sm text-gray-500">Loading user...</div>;
  }

  // Guard: Admin ยังไม่มี company → บังคับมาหน้า company profile
  if (currentUser.role === "Admin" && mustCreateCompany) {
    return <Navigate to="/dashboard/company-profile" replace />;
  }

  // Route: Company Profile
  return (
    <CompanyProfilePage
      isFirstTime={mustCreateCompany}
      currentUser={currentUser}
      onCompanyCreated={(companyId) => onCompanyCreated?.(companyId)}
    />
  );
};

export default RequireCompany;
