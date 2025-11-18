import React, { useState } from "react";
import ForgotPassword from "./ForgotPassword";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

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
      <div className="w-full max-w-md bg-white/80 backdrop-blur rounded-xl shadow-lg px-8 py-10">
        <h1 className="text-4xl text-center font-semibold text-gray-800 mb-10">
          Login
        </h1>
        <p className="text-sm text-center text-gray-500 mb-6">
          Enter your email and password to login
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          {/* Email / Username */}
          <div className="space-y-2">
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-gray-700"
            ></label>
            <input
              id="identifier"
              type="text"
              placeholder="Email or Username"
              className="w-full rounded-lg border border-gray-200 bg-gray-50/60 px-4 py-3 text-sm text-gray-900 outline-none ring-0 focus:border-gray-400 focus:bg-white focus:ring-1 focus:ring-gray-200 transition"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            ></label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full rounded-lg border border-gray-200 bg-gray-50/60 px-4 py-3 pr-12 text-sm text-gray-900 outline-none ring-0 focus:border-gray-400 focus:bg-white focus:ring-1 focus:ring-gray-200 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <IoIosEye className="h-5 w-5" />
                ) : (
                  <IoIosEyeOff className="h-5 w-5" />
                )}
              </button>
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
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-12  w-28 rounded-md bg-blue-500 py-2 text-sm font-medium text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-70 mx-auto block"
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
