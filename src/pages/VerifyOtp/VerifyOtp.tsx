import React, { useState, useEffect } from "react";
import {  Mail, Phone } from "lucide-react";
import { useVerifyOtpMutation } from "@/redux/features/auth/authApi";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const VerifyOtp: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [timer, setTimer] = useState(300); // 5 minutes
  const [contact, setContact] = useState("");
  const [contactType, setContactType] = useState<"email" | "phone">("email");

  useEffect(() => {
    if (location.state) {
      setContact(location.state.contact || "");
      setContactType(location.state.contactType || "email");
    } else {
      // If no state, redirect to forgot password
      navigate("/forgot-password");
    }
  }, [location, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const otpString = otp.join("");
    if (otpString.length !== 4) {
      setErrorMessage("Please enter the 4-digit OTP");
      return;
    }

    if (timer <= 0) {
      setErrorMessage("OTP has expired. Please request a new one.");
      return;
    }

    const verifyToast = toast.loading("Verifying OTP...");

    try {
      const credentials = contactType === "email" 
        ? { email: contact, otp: otpString }
        : { phone: contact, otp: otpString };

      const result = await verifyOtp(credentials).unwrap();

      if (result.success) {
        toast.success("OTP verified successfully!", { id: verifyToast });
        
        // Navigate to reset password page with contact info
        navigate("/reset-password", { 
          state: { 
            contact,
            contactType
          } 
        });
      } else {
        toast.error("Invalid OTP", { id: verifyToast });
        setErrorMessage("Invalid OTP. Please try again.");
      }
    } catch (err: any) {
      let errorMsg = "Failed to verify OTP. Please try again.";

      if (err.status === 400) {
        errorMsg = "Invalid OTP. Please check and try again.";
      } else if (err.status === 410) {
        errorMsg = "OTP has expired. Please request a new one.";
      } else if (err.data?.message) {
        errorMsg = err.data.message;
      }

      toast.error(errorMsg, { id: verifyToast });
      setErrorMessage(errorMsg);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg py-10 px-4 md:py-18 md:px-10 w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Verify OTP
          </h1>
          <p className="text-sm text-gray-500 mb-4">
            Enter the 4-digit OTP sent to your{" "}
            {contactType === "email" ? "email" : "phone"}
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            {contactType === "email" ? <Mail size={18} /> : <Phone size={18} />}
            <span className="text-sm">{contact}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              4-Digit OTP
            </label>
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-16 h-16 text-center text-2xl font-bold bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800"
                  disabled={isLoading}
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          <div className="mb-6 text-center">
            <div className="text-sm text-gray-600 mb-2">
              Time remaining:{" "}
              <span className={`font-semibold ${timer < 60 ? "text-red-600" : "text-gray-800"}`}>
                {formatTime(timer)}
              </span>
            </div>
            {timer <= 0 && (
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-[#FFCC00] hover:text-[#e6b800] font-medium"
              >
                Resend OTP
              </button>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errorMessage}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || timer <= 0}
            className="w-full bg-[#FFCC00] hover:bg-[#f5c609] text-gray-800 font-semibold py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer mb-4"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Use different {contactType === "email" ? "email" : "phone"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;