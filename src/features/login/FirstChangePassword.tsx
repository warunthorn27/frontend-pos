import React, { useState } from "react";
import { changeFirstPasswordApi } from "../../services/auth";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      // ไม่มี token แล้ว ให้ App จัดการ logout / กลับไปหน้า login
      if (onLogout) onLogout();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("Attempting to change password for userId:", userId);
      await changeFirstPasswordApi(token, userId, password);
      console.log("Password changed successfully");

      setSuccess(true);
    } catch (err: unknown) {
      console.error("Password change failed:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
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
            <svg
              width="90"
              height="90"
              viewBox="0 0 135 135"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_2300_1595)">
                <path
                  d="M48.1516 20.7562C42.0095 23.2987 36.4283 27.0258 31.7266 31.725"
                  stroke="#34C759"
                  stroke-width="7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M20.7563 48.15C18.2056 54.283 16.8868 60.8579 16.875 67.5"
                  stroke="#34C759"
                  stroke-width="7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M20.7578 86.85C23.3002 92.992 27.0274 98.5732 31.7266 103.275"
                  stroke="#34C759"
                  stroke-width="7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M48.1484 114.244C54.2814 116.794 60.8563 118.113 67.4984 118.125"
                  stroke="#34C759"
                  stroke-width="7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M86.8516 114.244C92.9936 111.701 98.5748 107.974 103.277 103.275"
                  stroke="#34C759"
                  stroke-width="7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M114.242 86.85C116.793 80.7171 118.112 74.1422 118.123 67.5"
                  stroke="#34C759"
                  stroke-width="7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M114.242 48.15C111.7 42.0079 107.973 36.4267 103.273 31.725"
                  stroke="#34C759"
                  stroke-width="7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M86.85 20.7563C80.7171 18.2056 74.1422 16.8868 67.5 16.875"
                  stroke="#34C759"
                  stroke-width="7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M50.625 67.5L61.875 78.75L84.375 56.25"
                  stroke="#34C759"
                  stroke-width="7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_2300_1595">
                  <rect width="135" height="135" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>

          <p className="mt-6 text-gray-700">
            You have successfully changed your password
          </p>

          <button
            onClick={onSuccess}
            className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-2 rounded-md mb-2 mt-8"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // change password page
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="bg-white w-[500px] p-10 rounded-xl shadow-lg text-center">
        <div className="flex justify-center mb-4">
          <svg
            width="42"
            height="42"
            viewBox="-25 -25 90 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="20"
              cy="20"
              r="45"
              stroke="#A3A8B8"
              strokeWidth="6"
              fill="none"
            />
            <path
              d="M14 28C12.9 28 11.9583 27.6083 11.175 26.825C10.3917 26.0417 10 25.1 10 24C10 22.9 10.3917 21.9583 11.175 21.175C11.9583 20.3917 12.9 20 14 20C15.1 20 16.0417 20.3917 16.825 21.175C17.6083 21.9583 18 22.9 18 24C18 25.1 17.6083 26.0417 16.825 26.825C16.0417 27.6083 15.1 28 14 28ZM14 36C10.6667 36 7.83333 34.8333 5.5 32.5C3.16667 30.1667 2 27.3333 2 24C2 20.6667 3.16667 17.8333 5.5 15.5C7.83333 13.1667 10.6667 12 14 12C16.2333 12 18.2583 12.55 20.075 13.65C21.8917 14.75 23.3333 16.2 24.4 18H42L48 24L39 33L35 30L31 33L26.75 30H24.4C23.3333 31.8 21.8917 33.25 20.075 34.35C18.2583 35.45 16.2333 36 14 36ZM14 32C15.8667 32 17.5083 31.4333 18.925 30.3C20.3417 29.1667 21.2833 27.7333 21.75 26H28L30.9 28.05L35 25L38.55 27.75L42.3 24L40.3 22H21.75C21.2833 20.2667 20.3417 18.8333 18.925 17.7C17.5083 16.5667 15.8667 16 14 16C11.8 16 9.91667 16.7833 8.35 18.35C6.78333 19.9167 6 21.8 6 24C6 26.2 6.78333 28.0833 8.35 29.65C9.91667 31.2167 11.8 32 14 32Z"
              fill="#0088FF"
            />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-gray-900">
          Change password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 pr-10 text-gray-900 placeholder-gray-400 text-sm focus:outline-none ring-0 focus:border-gray-400 focus:bg-white focus:ring-1 focus:ring-gray-200"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <IoIosEye className="h-5 w-5" />
              ) : (
                <IoIosEyeOff className="h-5 w-5" />
              )}
            </button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#0088FF] hover:bg-[#037be4] text-white px-5 py-2.5 rounded-md mb-2 mt-3"
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
