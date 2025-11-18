import React, { useState } from "react";
import ForgotPassword from "./ForgotPassword";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState(""); // email หรือ username
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showForgot, setShowForgot] = useState(false);

  // ถ้ากด forgot password >> แสดงหน้า ForgotPassword
  if (showForgot) {
    return <ForgotPassword onBack={() => setShowForgot(false)} />;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // ไว้เปลี่ยนเป็นเรียก API จริงทีหลัง
    setTimeout(() => {
      // alert(`Login with\nIdentifier: ${identifier}\nPassword: ${password}`);
      setIsSubmitting(false);
      onLoginSuccess(); // แจ้ง App ว่าล็อกอินสำเร็จ
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="w-full max-w-md bg-white/80 backdrop-blur rounded-3xl shadow-lg px-8 py-10">
        <h1 className="text-3xl text-center font-semibold text-gray-900 mb-10">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email / Username */}
          <div className="space-y-2">
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-gray-700"
            >
              Email or Username
            </label>
            <input
              id="identifier"
              type="text"
              placeholder="Enter your email or username"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 px-4 py-3 text-sm text-gray-900 outline-none ring-0 focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-200 transition"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <button
                type="button"
                className="text-xs text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 px-4 py-3 pr-10 text-sm text-gray-900 outline-none ring-0 focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-200 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-xs font-medium text-gray-500 hover:text-gray-700"
              onClick={() => setShowForgot(true)}
            >
              Forgot password?
            </button>
          </div>

          {/* Sign in button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full bg-black py-3 text-sm font-medium text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Confirm"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
