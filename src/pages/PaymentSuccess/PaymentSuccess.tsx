import React from "react";
import { CheckCircle } from "lucide-react";

const PaymentSuccess: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
      <div className="bg-[#1e1e1e] border border-[#eab308]/20 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#eab308]"></div>

        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#eab308]/10 rounded-full mb-6 animate-bounce">
          <CheckCircle className="w-12 h-12 text-[#eab308]" />
        </div>

        <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-2">
          Payment <span className="text-[#eab308]">Success!</span>
        </h1>

        <p className="text-gray-400 text-sm mb-8">
          Thank you for your order. Your payment was processed successfully, and
          ZipBee is already buzzing to get your delivery ready!
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
