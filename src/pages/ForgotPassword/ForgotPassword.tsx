import React, { useState } from "react";
import { Mail, Phone } from "lucide-react";
import { useForgotPasswordMutation } from "@/redux/features/auth/authApi";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [useEmail, setUseEmail] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email && !phone) {
      setErrorMessage(useEmail ? "Email is required" : "Phone number is required");
      return;
    }

    const forgotToast = toast.loading("Sending OTP...");

    try {
      const credentials = useEmail 
        ? { email: email.trim() }
        : { phone: phone.trim() };

      const result = await forgotPassword(credentials).unwrap();

      if (result.success) {
        toast.success("OTP sent successfully!", { id: forgotToast });
        
        // Navigate to verify OTP page with the email/phone
        navigate("/verify-otp", { 
          state: { 
            contact: useEmail ? email : phone,
            contactType: useEmail ? "email" : "phone"
          } 
        });
      } else {
        toast.error("Failed to send OTP", { id: forgotToast });
        setErrorMessage(result.message || "Failed to send OTP");
      }
    } catch (err: any) {
      let errorMsg = "Failed to send OTP. Please try again.";

      if (err.status === 404) {
        errorMsg = useEmail 
          ? "Email not found. Please check and try again." 
          : "Phone number not found. Please check and try again.";
      } else if (err.status === 400) {
        errorMsg = "Invalid request. Please check your input.";
      } else if (err.status === 500) {
        errorMsg = "Server error. Please try again later.";
      } else if (err.data?.message) {
        errorMsg = err.data.message;
      }

      toast.error(errorMsg, { id: forgotToast });
      setErrorMessage(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg py-10 px-4 md:py-18 md:px-10 w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Forgot Password
          </h1>
          <p className="text-sm text-gray-500">
            Enter your email or phone to receive OTP
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Toggle between email and phone */}
          <div className="mb-6">
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                onClick={() => setUseEmail(true)}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  useEmail
                    ? "bg-[#FFCC00] text-gray-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Use Email
              </button>
              <button
                type="button"
                onClick={() => setUseEmail(false)}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  !useEmail
                    ? "bg-[#FFCC00] text-gray-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Use Phone
              </button>
            </div>

            {useEmail ? (
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-700 pl-11"
                    placeholder="Enter your email"
                    required={useEmail}
                    disabled={isLoading}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <Mail size={20} />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-700 pl-11"
                    placeholder="Enter your phone number"
                    required={!useEmail}
                    disabled={isLoading}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <Phone size={20} />
                  </div>
                </div>
              </div>
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
            disabled={isLoading}
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
                Sending OTP...
              </>
            ) : (
              "Send OTP"
            )}
          </button>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;