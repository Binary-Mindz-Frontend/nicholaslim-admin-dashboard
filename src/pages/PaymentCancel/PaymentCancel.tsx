import React from "react";
import { XCircle } from "lucide-react";

const PaymentCancel: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
      <div className="bg-[#1e1e1e] border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-red-500"></div>

        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 rounded-full mb-6">
          <XCircle className="w-12 h-12 text-red-500" />
        </div>

        <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-2">
          Payment <span className="text-red-500">Canceled</span>
        </h1>

        <p className="text-gray-400 text-sm mb-8">
          The transaction was canceled or couldn't be completed. Don't worry, no
          funds were deducted from your account.
        </p>
      </div>
    </div>
  );
};

export default PaymentCancel;
