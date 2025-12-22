import { Navigate, useOutletContext } from "react-router-dom";
import CompanyProfilePage from "../features/company/CompanyProfilePage";
import type { DashboardOutletContext } from "../layouts/DashboardLayout";

const RequireCompany: React.FC = () => {
  const { mustCreateCompany, onCompanyCreated, currentUser } =
    useOutletContext<DashboardOutletContext>();

  if (!currentUser) {
    return <div className="p-6 text-sm text-gray-500">Loading user...</div>;
  }

  // Guard อย่างเดียว
  if (currentUser.role === "Admin" && mustCreateCompany) {
    return <Navigate to="/dashboard/company-profile" replace />;
  }

  return (
    <CompanyProfilePage
      currentUser={currentUser}
      onCompanyCreated={(companyId) => onCompanyCreated?.(companyId)}
    />
  );
};

export default RequireCompany;
