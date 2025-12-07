import React, { useState } from "react";
import ForgotPassword from "./ForgotPassword";
import { loginApi } from "../../services/auth";
import type { LoginResponse } from "../../types/auth";
import warningIcon from "../../assets/svg/warning-icon.svg";
import EyeIcon from "../../assets/svg/eye.svg?react";
import EyeOffIcon from "../../assets/svg/eye-slash.svg?react";

interface LoginPageProps {
  onLoginSuccess: (data: LoginResponse) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [errors, setErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});

  const hasIdentifierError = !!errors.identifier;
  const hasPasswordError = !!errors.password;

  if (showForgot) {
    return <ForgotPassword onBack={() => setShowForgot(false)} />;
  }

  const validateForm = () => {
    const newErrors: { identifier?: string; password?: string } = {};

    if (!identifier.trim())
      newErrors.identifier = "Please enter valid email or username !";
    if (!password.trim()) newErrors.password = "Invalid password !";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const data = await loginApi(identifier, password);
      onLoginSuccess(data);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials and try again.");
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
                onChange={(e) => {
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
                onChange={(e) => {
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
              >
                {showPassword ? (
                  <EyeIcon className="h-6 w-6" />
                ) : (
                  <EyeOffIcon className="h-6 w-6" />
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
