import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";
import { loginApi } from "../../services/auth";
import { saveAuth } from "../../utils/authStorage";
import type { LoginResponse } from "../../types/auth";
import warningIcon from "../../assets/svg/warning-icon.svg";
import EyeIcon from "../../assets/svg/eye.svg?react";
import EyeOffIcon from "../../assets/svg/eye-slash.svg?react";

interface LoginPageProps {
  onLoginSuccess: (data: LoginResponse) => void;
}

type FieldErrors = {
  identifier?: string;
  password?: string;
};

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showForgot, setShowForgot] = useState<boolean>(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string>("");

  const hasIdentifierError = Boolean(errors.identifier);
  const hasPasswordError = Boolean(errors.password);

  if (showForgot) {
    return <ForgotPassword onBack={() => setShowForgot(false)} />;
  }

  const validateForm = (): boolean => {
    const next: FieldErrors = {};
    if (!identifier.trim()) next.identifier = "Please enter email or username.";
    if (!password.trim()) next.password = "Please enter your password.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const data = await loginApi(identifier, password);

      // เก็บ token/user ลง storage ก่อน
      saveAuth(data);

      // ให้ App sync state (currentUser/token) และปลดล็อกหน้าอื่นๆ
      onLoginSuccess(data);

      // ไป dashboard
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="w-full max-w-md bg-white backdrop-blur rounded-xl shadow-lg px-8 py-10">
        <h1 className="text-4xl text-center font-regular text-[#084072] mb-8">
          Login
        </h1>

        <p className="text-sm text-center text-[#9D9D9D] font-regular mb-6">
          Enter your email and password to log in
        </p>

        {serverError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          {/* Email / Username */}
          <div className="space-y-2">
            <div className="relative">
              <input
                id="identifier"
                type="text"
                placeholder="Email or Username"
                className={`
                  w-full rounded-lg px-4 py-3 pr-10 text-sm text-gray-900 font-light
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

              {hasIdentifierError && (
                <span className="absolute inset-y-0 right-3 flex items-center">
                  <img src={warningIcon} alt="" className="w-5 h-5" />
                </span>
              )}
            </div>

            {errors.identifier && (
              <p className="text-red-500 text-xs">{errors.identifier}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`
                  w-full rounded-lg px-4 py-3 pr-12 text-sm text-gray-900 font-light
                  outline-none transition bg-white
                  ${
                    hasPasswordError
                      ? "border border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                      : "border border-gray-300/70 focus:border-gray-400 focus:bg-white focus:ring-1 focus:ring-gray-200"
                  }
                `}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
              />

              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeIcon className="h-5 w-6 text-gray-500" />
                ) : (
                  <EyeOffIcon className="h-5 w-6 text-gray-500" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-xs font-regular text-[#545454] hover:text-blue-600 hover:underline"
              onClick={() => setShowForgot(true)}
            >
              Forgot Password ?
            </button>
          </div>

          {/* Login button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 w-28 bg-[#0088FF] hover:bg-[#037be4] text-white py-2 rounded-md mb-2 disabled:cursor-not-allowed disabled:opacity-70 mx-auto block"
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
