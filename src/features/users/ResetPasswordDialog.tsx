import React, { useEffect, useMemo, useRef, useState } from "react";
import type { UserListItem } from "../../types/user";
import LockIcon from "../../assets/svg/lock.svg?react";
import CloseIcon from "../../assets/svg/close.svg?react";
import CheckIcon from "../../assets/svg/check.svg?react";
import CopyIcon from "../../assets/svg/copy.svg?react";

type Step = "confirm" | "success";

function generatePassword(len = 8) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < len; i++) {
    out += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return out;
}

type ToastState = {
  open: boolean;
  title: string;
  message: string;
};

function SuccessToast({
  open,
  title,
  message,
}: {
  open: boolean;
  title: string;
  message: string;
}) {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[10050] pointer-events-none">
      <div
        className={[
          "flex items-start gap-3",
          "min-w-[320px] max-w-[92vw]",
          "rounded-xl border border-green-300 bg-green-50",
          "px-5 py-4 shadow-md",
          "transition-all duration-200",
          open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
        ].join(" ")}
      >
        <div className="mt-0.5 w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6L9 17l-5-5"
              stroke="#16A34A"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex-1">
          <div className="text-[18px] font-semibold text-gray-900">{title}</div>
          <div className="text-[18px] text-gray-600 leading-snug">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ResetPasswordDialogProps {
  open: boolean;
  user: UserListItem | null;
  onClose: () => void;

  // รับได้ทั้ง Promise<string> หรือ Promise<void> ก็ได้ (เราไม่ได้ใช้ค่าที่คืนมา)
  onResetPassword: (
    userId: string,
    newPassword: string,
    sendEmail: boolean,
  ) => Promise<unknown>;
}

const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({
  open,
  user,
  onClose,
  onResetPassword,
}) => {
  const [step, setStep] = useState<Step>("confirm");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string>("");

  // toast
  const [toast, setToast] = useState<ToastState>({
    open: false,
    title: "Success",
    message: "",
  });
  const toastTimerRef = useRef<number | null>(null);

  const canSendEmail = useMemo(() => {
    if (!user) return false;
    if (user.status !== "active") return false; // inactive ห้ามส่ง
    const e = user.email?.trim() ?? "";
    return e.length > 0;
  }, [user]);

  const showToast = (title: string, message: string, ms = 2600) => {
    // clear old timer
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }

    setToast({ open: true, title, message });

    toastTimerRef.current = window.setTimeout(() => {
      setToast((t) => ({ ...t, open: false }));
      toastTimerRef.current = null;
    }, ms);
  };

  // cleanup timer เมื่อ unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
        toastTimerRef.current = null;
      }
    };
  }, []);

  // reset state ทุกครั้งที่เปิด/เปลี่ยน user
  useEffect(() => {
    if (!open) return;

    setStep("confirm");
    setPassword("");
    setLoading(false);
    setSendingEmail(false);
    setEmailSent(false);
    setError("");
  }, [open, user?.id]);

  const closeAll = () => {
    onClose();
  };

  const handleReset = async () => {
    if (!user) return;

    try {
      setError("");
      setLoading(true);

      const newPass = generatePassword(8);

      // 1) reset แบบไม่ส่งอีเมลก่อน
      await onResetPassword(user.id, newPass, false);

      setPassword(newPass);
      setStep("success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!user || !canSendEmail || !password) return;

    try {
      setError("");
      setSendingEmail(true);

      // 2) ส่งอีเมล (ใช้ endpoint send) ด้วย password เดิม
      await onResetPassword(user.id, password, true);

      setEmailSent(true);

      // ปิด dialog ทันที แล้วโชว์ toast แบบในรูป
      closeAll();
      showToast("Success", "Send Password to Email successfully.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Send email failed");
    } finally {
      setSendingEmail(false);
    }
  };

  const handleCopyPassword = async () => {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      // showToast("Copied", "Password copied to clipboard");
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <>
      <SuccessToast
        open={toast.open}
        title={toast.title}
        message={toast.message}
      />

      {/* Modal */}
      {open && user && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30">
          <div className="relative w-[500px] rounded-xl bg-white shadow-lg px-8 py-8">
            {/* Close */}
            <button
              type="button"
              onClick={closeAll}
              className="absolute right-4 top-4"
              aria-label="Close"
            >
              <CloseIcon className="w-7 h-7" />
            </button>

            {step === "confirm" && (
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-20 h-20 rounded-full bg-[#E5F3FF] flex items-center justify-center">
                  {/* lock icon */}
                  <LockIcon className="w-[60px] h-[60px] text-[#0088FF]" />
                </div>

                <h3 className="text-lg font-normal mt-2">
                  Reset password for this User
                </h3>
                <p className="text-[#545454] text-base font-light">
                  This will Automatically generate a password
                </p>

                {error && (
                  <p className="text-sm text-red-600 mt-1 whitespace-pre-wrap">
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="mt-6 px-8 py-2 rounded-md bg-[#0690F1] text-white font-normal text-base hover:bg-[#0071CE] disabled:opacity-50"
                >
                  {loading ? "Resetting..." : "Reset"}
                </button>
              </div>
            )}

            {step === "success" && (
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 rounded-full bg-[#DFF9E5] flex items-center justify-center">
                  {/* check icon */}
                  <CheckIcon className="w-[60px] h-[60px]" />
                </div>

                <h3 className="text-lg font-normal">
                  Reset password Successful !
                </h3>

                <div className="relative mb-2 w-[260px]">
                  <input
                    value={password}
                    readOnly
                    className="w-full py-2 rounded-md border border-gray-300 px-3 text-left text-sm font-light"
                  />

                  <button
                    type="button"
                    onClick={handleCopyPassword}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                    title="Copy password"
                  >
                    <CopyIcon className="w-5 h-5" />
                  </button>
                </div>

                {error && (
                  <p className="text-sm text-red-600 mt-1 whitespace-pre-wrap">
                    {error}
                  </p>
                )}

                <div className=" flex items-center gap-3 mb-2">
                  <button
                    type="button"
                    onClick={closeAll}
                    className="w-[120px] px-4 py-1.5 bg-white border border-[#CFCFCF] text-base hover:bg-[#F1F1F1] text-black rounded-md"
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    onClick={handleSendEmail}
                    disabled={!canSendEmail || sendingEmail || emailSent}
                    className="w-[120px] px-4 py-1.5 rounded-md bg-[#0088FF] text-white hover:bg-[#0574D6] disabled:opacity-50 disabled:cursor-not-allowed"
                    title={
                      !canSendEmail ? "This user cannot receive emails." : ""
                    }
                  >
                    {emailSent
                      ? "Sent"
                      : sendingEmail
                        ? "Sending..."
                        : "Send Email"}
                  </button>
                </div>

                {!canSendEmail && (
                  <p className="text-xs text-gray-500 mt-2">
                    This user cannot receive emails.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ResetPasswordDialog;
