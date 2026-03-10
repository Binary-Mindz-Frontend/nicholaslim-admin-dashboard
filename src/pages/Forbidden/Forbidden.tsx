// pages/Forbidden/Forbidden.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, LogIn } from "lucide-react";

interface ForbiddenProps {
  message?: string;
}

const Forbidden: React.FC<ForbiddenProps> = ({
  message = "You don't have permission to access this page.",
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center px-4">
      <div className="relative">
        <Shield className="w-24 h-24 text-yellow-400" />
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-yellow-600">
          403
        </span>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-2">
        Access Forbidden
      </h1>

      <div className="w-16 h-1 bg-yellow-400 rounded-full my-4" />

      <p className="text-gray-500 text-center max-w-sm mb-8">{message}</p>

      <div className="flex gap-3">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2"
        >
          <LogIn size={18} />
          Go To Login Page
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 border border-yellow-400 text-yellow-500 hover:bg-yellow-50 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Forbidden;
