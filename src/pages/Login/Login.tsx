import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/redux/hook";
import toast from "react-hot-toast";
import { useGetRoleUserPermissionsQuery } from "@/redux/features/roleBasedAccessControl/roleBasedAccessControlApi";
import { getAllAvailableRoutes } from "@/utils/permissionMapping";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberPassword, setRememberPassword] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [shouldFetchPermissions, setShouldFetchPermissions] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  const { data: permissionsData, isLoading: isLoadingPermissions } =
    useGetRoleUserPermissionsQuery(undefined, {
      skip: !shouldFetchPermissions,
    });

  useEffect(() => {
    if (errorMessage) {
      setErrorMessage("");
    }
  }, [email, password]);

  useEffect(() => {
    if (permissionsData && !isLoadingPermissions) {
      handleNavigation(permissionsData);
    }
  }, [permissionsData, isLoadingPermissions]);

  const handleNavigation = (permissionsData: any) => {
    if (permissionsData?.permissions?.dashboard?.includes("read")) {
      navigate("/");
      return;
    }
    
    const availableRoutes = getAllAvailableRoutes(permissionsData);
    
    if (availableRoutes.length > 0) {
      navigate(`/${availableRoutes[0]}`);
    } else {
      navigate("/profile");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const loginToast = toast.loading("Signing in...");

    try {
      const credentials = {
        email: email.trim(),
        password: password,
      };

      const result = await login(credentials).unwrap();

      if (result.access_token) {
        dispatch(
          setCredentials({
            accessToken: result.access_token,
          })
        );

        toast.success("Login successful!", { id: loginToast });
        setShouldFetchPermissions(true);
      } else {
        toast.error("Login response missing required token", {
          id: loginToast,
        });
        setErrorMessage("Login response missing required token");
      }
    } catch (err: any) {
      let errorMsg = "Login failed. Please try again.";

      if (err.status === 401) {
        errorMsg = "Invalid email or password. Please try again.";
      } else if (err.status === 400) {
        errorMsg = "Invalid request format. Please check your input.";
      } else if (err.status === 500) {
        errorMsg = "Server error. Please try again later.";
      } else if (err.status === "FETCH_ERROR") {
        errorMsg = "Network error. Please check your connection.";
      } else if (err.data?.message) {
        errorMsg = err.data.message;
      }

      toast.error(errorMsg, { id: loginToast });
      setErrorMessage(errorMsg);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg py-10 px-4 md:py-18 md:px-10 w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Login to Account
          </h1>
          <p className="text-sm text-gray-500">
           Please enter your mobile number, email address, or login ID along with your password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mobile Number / Email / Login ID
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-700 pl-11"
                placeholder="mobile / email / login id"
                required
                disabled={isLoading}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <User size={20} />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-700 pl-11 pr-12"
                placeholder="password"
                required
                disabled={isLoading}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Lock size={20} />
              </div>
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberPassword}
                onChange={(e) => setRememberPassword(e.target.checked)}
                className="w-4 h-4 border-gray-300 rounded focus:ring-yellow-400 cursor-pointer"
                style={{ accentColor: "#FFCC00" }}
                disabled={isLoading}
              />
              <span className="ml-2 text-sm text-gray-600">
                Remember Password
              </span>
            </label>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errorMessage}</p>
            </div>
          )}

          {isLoadingPermissions && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-600 text-sm flex items-center">
                <svg
                  className="animate-spin mr-2 h-4 w-4 text-blue-600"
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
                Loading permissions...
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || isLoadingPermissions}
            className="w-full bg-[#FFCC00] hover:bg-[#f5c609] text-gray-800 font-semibold py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
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
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;