import React, { useEffect, useMemo, useState } from "react";
import CompanyForm, { type CompanyFormValues } from "./CompanyForm";
import CompanyProfileView from "./CompanyProfileView";
import type { AuthUser } from "../../types/auth";
import {
  createCompany,
  getCompanyById,
  mapCompanyApiToForm,
  mapCompanyFormToPayload,
  updateCompany,
} from "../../services/company";
import { setCompanyId as persistCompanyId } from "../../utils/authStorage";
import { getCompanyId } from "../../utils/authStorage";

type Mode = "create" | "view" | "edit";

function getUserCompanyId(u?: AuthUser | null): string | null {
  if (!u) return null;

  const raw =
    (u as unknown as { companyId?: string }).companyId ??
    (u as unknown as { comp_id?: string }).comp_id ??
    (u as unknown as { compId?: string }).compId ??
    null;

  // fallback: ถ้า user object ยังไม่อัปเดต ให้ใช้ค่าที่ persist ไว้
  return raw ?? getCompanyId() ?? null;
}

type Props = {
  isFirstTime: boolean;
  currentUser?: AuthUser | null;
  onCompanyCreated: (companyId: string) => void;
};

const CompanyProfilePage: React.FC<Props> = ({
  isFirstTime,
  currentUser,
  onCompanyCreated,
}) => {
  const companyId = useMemo(() => getUserCompanyId(currentUser), [currentUser]);

  const [mode, setMode] = useState<Mode>(isFirstTime ? "create" : "view");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState<CompanyFormValues | null>(null);
  const [initialized, setInitialized] = useState(false);

  if (!currentUser) {
    return <div className="p-6 text-sm text-gray-500">Loading user...</div>;
  }

  // Get Company
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    let alive = true;

    const init = async () => {
      try {
        if (isFirstTime) {
          if (alive) {
            setMode("create");
            setInitialized(true);
          }
          return;
        }

        if (!companyId) {
          if (alive) {
            setMode("create");
            setInitialized(true);
          }
          return;
        }

        setLoading(true);
        const api = await getCompanyById(companyId);

        if (!alive) return;

        setCompany(mapCompanyApiToForm(api));
        setMode("view");
      } catch (e) {
        if (alive) {
          setError(e instanceof Error ? e.message : "Get company failed");
        }
      } finally {
        if (alive) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    init();

    return () => {
      alive = false;
    };
  }, [companyId, isFirstTime]);

  if (!initialized) {
    return <div className="p-6">Loading...</div>;
  }

  // Create/Update
  const handleSubmit = async (values: CompanyFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const payload = mapCompanyFormToPayload(values);

      if (mode === "create") {
        const created = await createCompany(payload);
        const newId = created._id;

        setCompany(mapCompanyApiToForm(created));
        setMode("view");

        // ปลดล็อก sidebar (DashboardLayout จะ set state)
        onCompanyCreated(newId);

        // กัน refresh หลุด
        persistCompanyId(newId);
      } else {
        if (!companyId) throw new Error("Missing companyId");
        const updated = await updateCompany(companyId, payload);
        setCompany(mapCompanyApiToForm(updated));
        setMode("view");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading && mode === "view" && !company) {
    return <div className="p-6">Loading...</div>;
  }

  if (error && mode === "view") {
    return (
      <div className="p-6">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (mode === "view" && company) {
    return (
      <CompanyProfileView
        data={company}
        onEdit={() => setMode("edit")}
        isSaving={loading}
      />
    );
  }

  return (
    <CompanyForm
      mode={mode === "edit" ? "edit" : "create"}
      initialValues={company}
      isFirstTime={isFirstTime}
      isSaving={loading}
      error={error}
      onCancel={() => (company ? setMode("view") : setMode("create"))}
      onSubmit={handleSubmit}
    />
  );
};

export default CompanyProfilePage;
