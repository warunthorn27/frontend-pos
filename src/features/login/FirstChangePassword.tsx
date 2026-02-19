import React, { useState } from "react";
import { changeFirstPasswordApi } from "../../services/auth";
import EyeIcon from "../../assets/svg/eye.svg?react";
import EyeOffIcon from "../../assets/svg/eye-slash.svg?react";
import key from "../../assets/svg/key.svg";
import check from "../../assets/svg/check.svg";

interface FirstChangePasswordProps {
  token: string;
  userId: string;
  onSuccess: () => void;
  onLogout?: () => void;
}

const FirstChangePassword: React.FC<FirstChangePasswordProps> = ({
  token,
  userId,
  onSuccess,
  onLogout,
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFieldError(null);
    setError(null);

    if (!password.trim()) {
      setFieldError("Please enter a new password");
      return;
    }

    if (!token) {
      if (onLogout) onLogout();
      return;
    }

    try {
      setLoading(true);

      await changeFirstPasswordApi(token, userId, password);

      setSuccess(true);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // success page
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="bg-white w-[500px] p-10 rounded-xl shadow-lg text-center">
          <div className="flex justify-center mb-4">
            <img src={check} alt="" className="w-24" />
          </div>

          <p className="mt-6 text-gray-700">
            You have successfully changed your password
          </p>

          <button
            onClick={onSuccess}
            className="bg-[#0088FF] hover:bg-[#037be4] text-white px-8 py-2 rounded-md mb-2 mt-8"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // change password page
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="bg-white w-[500px] p-10 rounded-xl shadow-lg text-center">
        <div className="flex justify-center mb-1">
          <img src={key} alt="" className="w-[86px]" />
        </div>

        <h2 className="text-2xl text-[#084072] font-normal py-6">
          Change password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="w-full mx-auto space-y-1">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full rounded-lg px-4 py-4 pr-12 text-sm outline-none transition bg-white
                  ${
                    fieldError
                      ? "border border-red-400 focus:border-red-500 focus:ring-red-200"
                      : "border border-gray-300 focus:border-[#005AA7]"
                  }
                  `}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldError) setFieldError(null);
                  if (error) setError(null);
                }}
              />

              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-6 w-6 text-gray-500" />
                ) : (
                  <EyeIcon className="h-6 w-6 text-gray-500" />
                )}
              </button>
            </div>

            {fieldError && (
              <p className="text-sm text-red-500 text-left">{fieldError}</p>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full bg-[#0690F1] hover:bg-[#0071CE] text-white py-2.5 rounded-md disabled:cursor-not-allowed disabled:opacity-70 mx-auto block"
          >
            {loading ? "Saving..." : "Change Password"}
          </button>
        </form>

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="mt-4 w-full text-sm text-gray-500 hover:underline"
          >
            Cancel and back to login
          </button>
        )}
      </div>
    </div>
  );
};

export default FirstChangePassword;
