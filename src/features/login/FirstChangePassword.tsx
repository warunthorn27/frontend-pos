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
            <img src={check} alt="" className="w-24" />
          </div>

          <p className="mt-6 text-gray-700">
            You have successfully changed your password
          </p>

          <button
            onClick={onSuccess}
            className="bg-[#0088FF] hover:bg-[#037be4] text-white px-8 py-2 rounded-md mb-2 mt-8"
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
        <div className="flex justify-center mb-1">
          <img src={key} alt="" className="w-20" />
        </div>

        <h2 className="text-2xl text-gray-800 font-regular py-6">
          Change password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative w-5/6 mx-auto">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 text-sm focus:outline-none ring-0 focus:border-gray-400 focus:bg-white focus:ring-1 focus:ring-gray-200"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeIcon className="h-5 w-6 text-gray-500" />
              ) : (
                <EyeOffIcon className="h-5 w-6 text-gray-500" />
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
