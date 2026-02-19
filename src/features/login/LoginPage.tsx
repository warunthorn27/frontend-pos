import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";
import { loginApi } from "../../services/auth";
import { saveAuth } from "../../utils/authStorage";
import type { LoginResponse } from "../../types/auth";
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

  const resetForm = () => {
    setIdentifier("");
    setPassword("");
    setServerError("");
    setErrors({});
  };

  if (showForgot) {
    return (
      <ForgotPassword
        onBack={() => {
          resetForm();
          setShowForgot(false);
        }}
      />
    );
  }

  const validateForm = (): boolean => {
    const next: FieldErrors = {};
    if (!identifier.trim()) next.identifier = "Invalid email !";
    if (!password.trim()) next.password = "Invalid password !";
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

      saveAuth(data);
      onLoginSuccess(data);
      navigate("/dashboard", { replace: true });
    } catch {
      setServerError("Invalid username or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="w-[500px] h-auto bg-white backdrop-blur rounded-xl shadow-lg px-10 py-10">
        <h1 className="text-5xl text-center font-normal text-[#084072] mt-10 mb-7">
          Login
        </h1>

        <p className="text-base text-center text-[#545454] font-light mb-7">
          Enter your email and password to log in
        </p>

        {serverError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-[20px]">
          {/* Email / Username */}
          <div className="space-y-1">
            <div className="relative">
              <input
                id="identifier"
                type="text"
                placeholder="Email or Username"
                className={`
                  w-full rounded-lg px-4 py-4 pr-10 text-sm text-black font-light placeholder-[#545454]
                  outline-none transition bg-white
                  ${
                    hasIdentifierError
                      ? "border border-red-400 focus:border-red-500 focus:ring-red-200"
                      : "border border-gray-300 focus:border-[#005AA7] focus:bg-white"
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

              {hasIdentifierError}
            </div>

            {errors.identifier && (
              <p className="text-[#FF383C] text-sm">{errors.identifier}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`
                  w-full rounded-lg px-4 py-4 pr-12 text-sm text-black font-light placeholder-[#545454]
                  outline-none transition bg-white
                  ${
                    hasPasswordError
                      ? "border border-red-400 focus:border-red-500 focus:ring-red-200"
                      : "border border-gray-300 focus:border-[#005AA7] focus:bg-white"
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
                  <EyeOffIcon className="h-6 w-6 text-gray-500" />
                ) : (
                  <EyeIcon className="h-6 w-6 text-gray-500" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-[#FF383C] text-sm">
                Invalid username or password !
              </p>
            )}
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-base font-light text-[#545454] hover:underline" //hover:text-blue-600
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
              className="mt-7 w-full bg-[#0690F1] hover:bg-[#0071CE] text-white py-2.5 rounded-md disabled:cursor-not-allowed disabled:opacity-70 mx-auto block"
            >
              {isSubmitting ? "Loading..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
