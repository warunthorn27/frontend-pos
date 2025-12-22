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
import {
  getCompanyId as getPersistedCompanyId,
  setCompanyId as persistCompanyId,
} from "../../utils/authStorage";

type Mode = "create" | "view" | "edit";

function getUserCompanyId(user?: AuthUser | null): string | null {
  if (!user) return null;

  const raw =
    (user as unknown as { companyId?: string }).companyId ??
    (user as unknown as { comp_id?: string }).comp_id ??
    (user as unknown as { compId?: string }).compId ??
    null;

  // fallback: ใช้ค่าที่ persist ไว้ (กรณี refresh)
  return raw ?? getPersistedCompanyId() ?? null;
}

type Props = {
  currentUser?: AuthUser | null;
  onCompanyCreated: (companyId: string) => void;
};

const CompanyProfilePage: React.FC<Props> = ({
  currentUser,
  onCompanyCreated,
}) => {
  // 🔑 source of truth สำหรับ companyId
  const authCompanyId = useMemo(
    () => getUserCompanyId(currentUser),
    [currentUser]
  );

  const [companyId, setCompanyId] = useState<string | null>(null);
  const [company, setCompany] = useState<CompanyFormValues | null>(null);
  const [mode, setMode] = useState<Mode>("view");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // =========================
  // INIT (ต้องอยู่ก่อน return)
  // =========================
  useEffect(() => {
    let alive = true;

    const init = async () => {
      try {
        // 🔒 ไม่มี companyId → บังคับ create
        if (!authCompanyId) {
          if (alive) {
            setCompanyId(null);
            setCompany(null);
            setMode("create");
            setInitialized(true);
          }
          return;
        }

        // ✅ มี companyId → โหลด company
        setLoading(true);
        const api = await getCompanyById(authCompanyId);

        if (!alive) return;

        setCompany(mapCompanyApiToForm(api));
        setCompanyId(api._id); // ⭐ สำคัญที่สุด
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
  }, [authCompanyId]);

  // =========================
  // GUARD RENDER
  // =========================
  if (!currentUser) {
    return <div className="p-6 text-sm text-gray-500">Loading user...</div>;
  }

  if (!initialized) {
    return <div className="p-6">Loading...</div>;
  }

  // =========================
  // CREATE / UPDATE
  // =========================
  const handleSubmit = async (values: CompanyFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const payload = mapCompanyFormToPayload(values);

      // ===== CREATE =====
      if (mode === "create") {
        const created = await createCompany(payload);

        setCompany(mapCompanyApiToForm(created));
        setCompanyId(created._id); // ⭐ set state
        setMode("view");

        // persist company id (กัน refresh)
        persistCompanyId(created._id);
        onCompanyCreated(created._id);
        return;
      }

      // ===== UPDATE =====
      if (!companyId) {
        throw new Error("Missing companyId");
      }

      const updated = await updateCompany(companyId, payload);
      setCompany(mapCompanyApiToForm(updated));
      setMode("view");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VIEW MODE
  // =========================
  if (mode === "view" && company) {
    return (
      <CompanyProfileView
        data={company}
        onEdit={() => setMode("edit")}
        isSaving={loading}
      />
    );
  }

  // =========================
  // CREATE / EDIT MODE
  // =========================
  return (
    <CompanyForm
      mode={mode === "edit" ? "edit" : "create"}
      initialValues={company}
      isFirstTime={mode === "create"}
      isSaving={loading}
      error={error}
      onCancel={() => setMode(company ? "view" : "create")}
      onSubmit={handleSubmit}
    />
  );
};

export default CompanyProfilePage;
