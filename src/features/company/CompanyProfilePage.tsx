import React, { useEffect, useMemo, useState } from "react";
import CompanyForm from "./components/CompanyForm";
import CompanyProfileView from "./components/CompanyProfileView";
import type { AuthUser } from "../../types/auth";
import {
  createCompany,
  getCompanyById,
  updateCompany,
} from "../../services/company";
import { getCompanyId as getPersistedCompanyId } from "../../utils/authStorage";
import type { CompanyFormValues } from "../../types/company";
import {
  mapCompanyApiToForm,
  mapCompanyFormToPayload,
} from "../../component/mappers/companyMapper";

type Mode = "create" | "view" | "edit";

function getUserCompanyId(user?: AuthUser | null): string | null {
  if (!user) return null;

  const raw =
    (user as unknown as { companyId?: string }).companyId ??
    (user as unknown as { comp_id?: string }).comp_id ??
    (user as unknown as { compId?: string }).compId ??
    null;

  return raw ?? getPersistedCompanyId() ?? null;
}

type Props = {
  currentUser?: AuthUser | null;
  onCompanyCreated: (companyId: string, logo?: string) => void;
};

const CompanyProfilePage: React.FC<Props> = ({
  currentUser,
  onCompanyCreated,
}) => {
  const authCompanyId = useMemo(
    () => getUserCompanyId(currentUser),
    [currentUser],
  );

  const [companyId, setCompanyId] = useState<string | null>(null);
  const [company, setCompany] = useState<CompanyFormValues | null>(null);
  const [mode, setMode] = useState<Mode>("view");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [removeOldImage, setRemoveOldImage] = useState(false);

  // =========================
  // INIT
  // =========================
  useEffect(() => {
    let alive = true;

    const init = async () => {
      try {
        if (!authCompanyId) {
          if (alive) {
            setCompanyId(null);
            setCompany(null);
            setMode("create");
            setInitialized(true);
          }
          return;
        }

        setLoading(true);
        const api = await getCompanyById(authCompanyId);
        if (!alive) return;

        console.log("Loaded company:", api);
        setCompany(mapCompanyApiToForm(api));
        setCompanyId(api._id);
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
  // GUARD
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
  const handleSubmit = async (
    values: CompanyFormValues,
    image: File | null,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      const payload = mapCompanyFormToPayload({
        companyName: values.companyName,
        taxId: values.taxId,
        email: values.email,
        phone: values.phone,
        country: values.country,
        companyAddress: values.companyAddress,
        province: values.province,
        district: values.district,
        subDistrict: values.subDistrict,
        zipcode: values.zipcode,
        contactName: values.contactName,
        contactPhone: values.contactPhone,
        contactEmail: values.contactEmail,
        currency: values.currency,
      });

      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (image instanceof File) {
        formData.append("files", image);
      }

      if (removeOldImage) {
        formData.append("removeFile", "true");
      }

      let updated;
      if (!companyId) {
        updated = await createCompany(formData);
      } else {
        updated = await updateCompany(companyId, formData);
      }

      // map ก่อน แล้วค่อย set
      const mapped = mapCompanyApiToForm(updated);

      // debug ดูให้ชัด
      console.log("AFTER MAP companyFile =", mapped.companyFile);

      setCompany(mapped);
      setMode("view");

      // ส่ง logo ให้ sidebar
      onCompanyCreated?.(updated._id, mapped.companyFile ?? undefined);
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
      onImageRemove={() => setRemoveOldImage(true)}
    />
  );
};

export default CompanyProfilePage;
