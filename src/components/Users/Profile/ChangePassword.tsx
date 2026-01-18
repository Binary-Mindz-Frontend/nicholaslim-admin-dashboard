/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { Key, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast"; // 1. Import Toast
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";

const ChangePassword = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    // 2. Use toast.promise for automated Loading/Success/Error states
    const passwordPromise = resetPassword({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    }).unwrap();

    toast.promise(passwordPromise, {
      loading: 'Updating password...',
      success: (res) => {
        reset(); // Clear form on success
        return res?.message || "Password updated successfully!";
      },
      error: (err) => err?.data?.message || "Could not update password.",
    }, {
        // Style to match your Navbar amber theme
        success: {
            iconTheme: { primary: '#f59e0b', secondary: '#fff' },
        },
    });
  };

  return (
    <div className="min-h-screen pt-28 pb-12 bg-[#F8FAFC] flex justify-center px-4">
      {/* 3. Add the Toaster component at the top level */}
      <Toaster position="top-right" reverseOrder={false} />

      <Card className="w-full max-w-md h-fit p-8 bg-white border-[#E6EFF5] shadow-sm">
        <div className="mb-6">
           <Link to="/" className="flex items-center text-xs text-gray-500 hover:text-amber-500 mb-4 transition-colors">
              <ArrowLeft className="w-3 h-3 mr-1" /> Back to Dashboard
           </Link>
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <Key className="w-6 h-6 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
          <p className="text-sm text-gray-500 mt-1">
            Ensure your account stays secure.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Old Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Old Password</label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                {...register("oldPassword", { required: "Old password is required" })}
                className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:bg-white outline-none transition-all"
                placeholder="Current password"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.oldPassword && <p className="text-red-500 text-xs">{errors.oldPassword.message as string}</p>}
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                {...register("newPassword", { 
                  required: "New password is required",
                  minLength: { value: 6, message: "At least 6 characters" }
                })}
                className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:bg-white outline-none transition-all"
                placeholder="New password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && <p className="text-red-500 text-xs">{errors.newPassword.message as string}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-all shadow-md shadow-amber-100 flex items-center justify-center gap-2 mt-4"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Update Password
          </button>
        </form>
      </Card>
    </div>
  );
};

export default ChangePassword;