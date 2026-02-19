import React, { useState } from "react";
import check from "../../assets/svg/check.svg";
import emailIcon from "../../assets/svg/email.svg";
import { forgotPasswordApi } from "../../services/auth";
import type { ApiMessageResponse } from "../../services/auth";

interface ForgotPasswordProps {
  onBack: () => void;
}

type FieldErrors = {
  identifier?: string;
  password?: string;
};

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [identifier, setIdentifier] = useState<string>("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const hasIdentifierError = Boolean(errors.identifier);

  const [apiResult, setApiResult] = useState<ApiMessageResponse | null>(null);

  const handleRequest = async () => {
    setErrorMessage(null);
    setErrors({});

    if (!identifier.trim()) {
      setErrors({ identifier: "Please enter your email !" });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await forgotPasswordApi(identifier.trim());
      console.log("Forgot Password Success", result);
      setApiResult(result);
      setSent(true);
    } catch {
      setErrorMessage("Email not found");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="bg-white w-[500px] h-auto p-10 rounded-xl shadow-lg text-center">
        {!sent ? (
          <>
            <div className="flex justify-center mb-1">
              <img src={emailIcon} alt="" className="w-[86px]" />
            </div>

            <h2 className="text-2xl text-[#084072] font-normal mt-[26px] mb-[20px]">
              Enter your email
            </h2>
            <p className="text-[#545454] text-base font-light mb-[20px]">
              Enter your email to request a password reset from the admin.
            </p>

            {errorMessage && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 text-left">
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col items-center">
              <input
                id="identifier"
                type="text"
                placeholder="Enter your email"
                className={`w-full h-[55px] rounded-lg px-4 py-4 pr-10 text-sm text-black font-light placeholder-[#545454]
                  outline-none transition bg-white
                  ${
                    hasIdentifierError
                      ? "border border-red-400 focus:border-red-500 focus:ring-red-200"
                      : "border border-gray-300 focus:border-[#005AA7]"
                  }
                  `}
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);

                  // ลบ validation error ทันทีเมื่อเริ่มพิมพ์
                  if (errors.identifier) {
                    setErrors((prev) => ({ ...prev, identifier: undefined }));
                  }

                  // ถ้ามี alert box จาก backend ก็ลบทิ้งด้วย
                  // if (errorMessage) {
                  //   setErrorMessage(null);
                  // }
                }}
              />
            </div>

            {errors.identifier && (
              <p className="text-[#FF383C] text-sm text-left mt-1">
                {errors.identifier}
              </p>
            )}

            <button
              onClick={handleRequest}
              disabled={isSubmitting}
              className="bg-[#0088FF] hover:bg-[#037be4] text-white w-full px-6 py-2.5 rounded-md mt-[26px] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Request"}
            </button>

            <div className="mt-4 text-sm text-[#545454]">
              <span>Already have an account? </span>
              <button
                type="button"
                onClick={onBack}
                className="underline text-[#084072] hover:text-blue-950"
              >
                Login
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <img src={check} alt="" className="w-[86px]" />
            </div>

            <p className="text-2xl text-[#084072] font-normal mt-[26px] mb-[20px]">
              Request sent successfully
            </p>

            {/* message after sent email */}
            {apiResult?.message && (
              <p className="text-base text-[#545454] font-light mb-4 px-2">
                The admin has been notified. Please check your email for the new
                password.
              </p>
            )}

            <button
              onClick={onBack}
              className="mt-7 w-full bg-[#0690F1] hover:bg-[#0071CE] text-white py-2.5 rounded-md disabled:cursor-not-allowed disabled:opacity-70 mx-auto block"
            >
              Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
