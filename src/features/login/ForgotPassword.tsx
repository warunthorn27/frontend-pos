import React, { useState } from "react";
import check from "../../images/check.svg";
import emailIcon from "../../images/email.svg";

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="bg-white w-[500px] p-10 rounded-xl shadow-lg text-center">
        {!sent ? (
          <>
            <div className="flex justify-center mb-1">
              <img src={emailIcon} alt="" className="w-[86px]" />
            </div>

            <h2 className="text-2xl text-gray-800 font-semibold py-6">
              Enter your email
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Enter your email to request a password reset from the admin.
            </p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-10/12 rounded-lg border border-gray-200 px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 text-sm focus:outline-none ring-0 focus:border-gray-400 focus:bg-white focus:ring-1 focus:ring-gray-200"
            />
            <button
              onClick={() => setSent(true)}
              className="bg-[#0088FF] hover:bg-[#037be4] text-white px-7 py-2 rounded-md mb-2 mt-6"
            >
              Request
            </button>
            <div>
              <button
                onClick={onBack}
                className="text-sm text-gray-500 hover:text-gray-800 underline"
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

            <p className="text-gray-700 mb-6">
              Your request has been successfully sent to the admin
            </p>

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
