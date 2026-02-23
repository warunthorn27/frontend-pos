import React from "react";

/* ========= STYLE PRESET ========= */

export const INPUT_CLASS =
  "w-full h-[38px] rounded-md border border-[#CFCFCF] px-3 text-base";

export const DISABLED_INPUT_CLASS =
  "w-full h-[38px] rounded-md border border-[#CFCFCF] bg-[#F5F5F5] px-3 text-sm";

export const LABEL_CLASS = "block text-base mb-2";

/* ========= LABEL ========= */

export const FormLabel: React.FC<{
  children: React.ReactNode;
  required?: boolean;
}> = ({ children, required }) => (
  <label className={LABEL_CLASS}>
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

/* ========= INPUT ========= */

export const FormTextInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement>
> = ({ className = "", ...props }) => (
  <input {...props} className={`${INPUT_CLASS} ${className}`} />
);

/* ========= TEXTAREA ========= */

export const FormTextarea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({ className = "", ...props }) => (
  <textarea
    {...props}
    className={`w-full rounded-md border border-[#CFCFCF] px-3 py-2 text-base focus:outline-none focus:border-[#2DA9FF] focus:ring-1 focus:ring-[#2DA9FF]/30 ${className}`}
  />
);
