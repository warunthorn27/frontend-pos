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
      setErrors({ identifier: "Please enter your email or username !" });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await forgotPasswordApi(identifier.trim());
      console.log("Forgot Password Success", result);
      setApiResult(result);
      setSent(true);
    } catch (err: unknown) {
      console.log("Forgot Password Error", err);
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
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

            <h2 className="text-2xl text-black font-normal mt-[26px] mb-[20px]">
              Enter your email
            </h2>
            <p className="text-[#545454] text-base mb-[20px]">
              Enter your email to request a password reset from the admin.
            </p>

            <div className="flex flex-col items-center">
              <input
                id="identifier"
                type="text"
                placeholder="Enter your email"
                className={`
                  w-[400px] h-[55px] rounded-lg px-4 py-4 pr-10 text-sm text-black font-light placeholder-[#545454]
                  outline-none transition bg-white
                  ${
                    hasIdentifierError
                      ? "border border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                      : "border border-gray-300/70 focus:border-gray-400 focus:bg-white focus:ring-1 focus:ring-gray-200"
                  }
                `}
                value={identifier}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setIdentifier(e.target.value);
                  if (errors.identifier) {
                    setErrors((prev) => ({ ...prev, identifier: undefined }));
                  }
                }}
              />
            </div>

            {errors.identifier && (
              <p className="text-[#FF383C] text-sm">{errors.identifier}</p>
            )}

            {errorMessage && (
              <p className="text-[#FF383C] text-sm">{errorMessage}</p>
            )}
            <button
              onClick={handleRequest}
              disabled={isSubmitting}
              className="bg-[#0088FF] hover:bg-[#037be4] text-white px-6 py-2.5 rounded-md mt-[26px] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Request"}
            </button>

            <div>
              <button
                onClick={onBack}
                className="text-sm text-[#545454] hover:text-gray-800 underline mt-4"
              >
                cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <img src={check} alt="" className="w-24" />
            </div>

            <p className="text-black mb-2">
              Your request has been successfully sent to the admin
            </p>

            {/* message after sent email */}
            {apiResult?.message && (
              <p className="text-xs text-[#545454] mb-4">{apiResult.message}</p>
            )}

            <button
              onClick={onBack}
              className="bg-[#0088FF] hover:bg-[#037be4] text-white px-8 py-2 rounded-md mb-2 mt-3"
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
