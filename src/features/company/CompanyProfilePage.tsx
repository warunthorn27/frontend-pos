import React, { useState } from "react";
import type { CompanyFormValues } from "./CompanyForm";
import CompanyProfileView from "./CompanyProfileView";
import CompanyForm from "./CompanyForm";

interface CompanyProfilePageProps {
  isFirstTime?: boolean;
  onCompanyCreated?: (companyId: string) => void;
}

type Mode = "create" | "view" | "edit";

const STORAGE_KEY = "companyProfile";

const CompanyProfilePage: React.FC<CompanyProfilePageProps> = ({
  isFirstTime = false,
  onCompanyCreated,
}) => {
  const [company, setCompany] = useState<CompanyFormValues | null>(() => {
    if (isFirstTime) {
      // For first time admin login, don't pre-fill from localStorage
      return null;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as CompanyFormValues) : null;
    } catch {
      return null;
    }
  });

  // ถ้ามี company อยู่แล้ว เปิดมาด้วยโหมด view เลย แต่ถ้า isFirstTime บังคับ create
  const [mode, setMode] = useState<Mode>(() =>
    isFirstTime || !localStorage.getItem(STORAGE_KEY) ? "create" : "view"
  );

  const handleSubmit = (values: CompanyFormValues) => {
    // เก็บทั้งใน state (ให้ UI ใช้) และใน localStorage (ให้จำข้ามรอบ)
    setCompany(values);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    if (isFirstTime && onCompanyCreated) {
      // TODO: ตรงนี้อนาคตค่อยเรียก API สร้าง Company จริง ๆ
      // const newCompanyId = await createCompanyApi(values, token);
      const newCompanyId = "TEMP_ID"; // สมมติ id ที่ backend ส่งกลับมา
      onCompanyCreated(newCompanyId);
    }
    setMode("view");
  };

  // ถ้าอยู่โหมด view และมีข้อมูล company แสดงหน้าโปรไฟล์
  if (mode === "view" && company) {
    return (
      <CompanyProfileView
        data={company}
        onEdit={() => setMode("edit")} // แก้ไขได้อย่างเดียว ไม่มี create ใหม่แล้ว
      />
    );
  }

  // ใช้ฟอร์มเดียวกันทั้ง create / edit
  return (
    <CompanyForm
      mode={mode as "create" | "edit"}
      initialValues={company} // ตอน create = null, ตอน edit = ค่าเดิม
      onCancel={() => setMode("view")}
      onSubmit={handleSubmit}
    />
  );
};

export default CompanyProfilePage;
