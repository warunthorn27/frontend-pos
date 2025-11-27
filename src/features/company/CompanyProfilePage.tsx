import React, { useState } from "react";
import type { CompanyFormValues } from "./CompanyForm";
import CompanyProfileView from "./CompanyProfileView";
import CompanyForm from "./CompanyForm";

type Mode = "create" | "view" | "edit";

const STORAGE_KEY = "companyProfile";

const CompanyProfilePage: React.FC = () => {
  const [company, setCompany] = useState<CompanyFormValues | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as CompanyFormValues) : null;
    } catch {
      return null;
    }
  });

  // ถ้ามี company อยู่แล้ว เปิดมาด้วยโหมด view เลย
  const [mode, setMode] = useState<Mode>(() =>
    localStorage.getItem(STORAGE_KEY) ? "view" : "create"
  );

  const handleSubmit = (values: CompanyFormValues) => {
    // เก็บทั้งใน state (ให้ UI ใช้) และใน localStorage (ให้จำข้ามรอบ)
    setCompany(values);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
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
