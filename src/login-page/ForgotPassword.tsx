import React, { useState } from "react";

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white w-[480px] p-10 rounded-xl shadow-lg text-center">
        {!sent ? (
          <>
            <h2 className="text-2xl font-semibold mb-3">Forgot Password ?</h2>
            <p className="text-gray-700 mb-6">
              Send a request to the admin to reset your password
            </p>

            <button
              onClick={() => setSent(true)}
              className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded-full mb-4"
            >
              Request
            </button>

            <div>
              <button
                onClick={onBack}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <div className="border-3 border-gray-400 rounded-full p-3">
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#A3A8B8"
                    strokeWidth="6"
                    fill="none"
                  />
                  <path
                    d="M32 52 L46 66 L72 38"
                    stroke="gray"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Your request has been successfully sent to the admin !
            </p>

            <button
              onClick={onBack}
              className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded-full"
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
