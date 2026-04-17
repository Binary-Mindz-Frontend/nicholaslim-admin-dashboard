/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  // baseUrl: "http://10.10.20.130:3000/api/v1",
  baseUrl: "https://api.zipbee.sg/api/v1",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
  credentials: "include",
});

const redirectToLogin = () => {
  if (typeof window !== "undefined") {
    // Clear all auth-related items from localStorage
    localStorage.removeItem("accessToken");
    // You might want to clear other auth-related items too
    // localStorage.removeItem("refreshToken");
    // localStorage.removeItem("user");

    // Only redirect if not already on login page to avoid infinite loops
    if (!window.location.pathname.includes("/login")) {
      window.location.href = "/login";
    }
  }
};

// const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
//   const result = await baseQuery(args, api, extraOptions);

//   const url = typeof args === "string" ? args : args.url;
//   const isLoginApi = url === "/auth/login";

//   // Handle 401 (Unauthorized) and 403 (Forbidden)
//   if (
//     !isLoginApi &&
//     (result?.error?.status === 401 || result?.error?.status === 403)
//   ) {
//     // Dispatch logout action to clear Redux state
//     api.dispatch(logout());

//     // Redirect to login
//     redirectToLogin();

//     // Return a custom error that can be handled by components
//     return {
//       error: {
//         status: result.error.status,
//         data: {
//           message:
//             result.error.status === 401
//               ? "Your session has expired. Please login again."
//               : "You don't have permission to access this resource.",
//         },
//       },
//     };
//   }

//   // Handle other errors (optional)
//   if (result?.error && !isLoginApi) {
//     console.error(`API Error (${url}):`, result.error);
//   }

//   return result;
// };

// Optional: Add refresh token logic
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  const url = typeof args === "string" ? args : args.url;
  const isLoginApi = url === "/auth/login";

  if (!isLoginApi && result?.error?.status === 401) {
    // Try to refresh token
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        api.dispatch(setCredentials({ accessToken }));
      } else {
        // Handle the case when the accessToken is not found in local storage
        // For example, you can redirect to the login page
        redirectToLogin();
      }
    } catch (error) {
      console.log(error);
      api.dispatch(logout());
      redirectToLogin();
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "VehicleType",
    "DeliveryType",
    "Quizzes",
    "Questions",
    "QuizResults",
    "UserTypes",
    "RiderProfiles",
    "StandardCommissionRate",
    "RaiderCompensationRole",
    "RaiderDeductionFee",
    "UserFeeStructure",
    "DynamicSurgePricing",
    "UserDynamicSurge",
    "Articles",
    "AboutUs",
    "FAQ",
    "Policy",
    "Content",
    "Notification",
    "Coins",
    "Incentives",
    "Advertisements",
    "fileUpload",
    "DriverOrderCompetition",
    "CustomerOrderConfirmation",
    "Users",
    "RoleBasedAccessControl",
    "Transactions",
    "ServiceZones",
    "Wallets",
    "Orders",
    "Transactions",
    "Stripe",
    "Kpi",
    "Coin",
    "Incentive",
    "DriverPerformance",
    "BulkOrdersTab",
    "ReportAndAnalytics",
    "Kpi",
    "Coin",
    "Incentive",
    "DriverPerformance",
    "Disputes",
    "BulkOrders",
    "AdditionalServices",
    "ServiceEmailNumber",
    "DashboardPopup",
    "PromoCodes",
    "Conversations",
    "Messages",
    "AdditionalServicesLogs",
    "SurgePricingRules",
  ],
  endpoints: () => ({}),
});
