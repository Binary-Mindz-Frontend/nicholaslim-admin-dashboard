import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://10.10.20.130:3000/api/v1",
  prepareHeaders: (headers, { getState }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const token = (getState() as any).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
  credentials: "include",
});

// const redirectToLogin = () => {
//   if (typeof window !== 'undefined') {
//     localStorage.removeItem('accessToken');
//     window.location.href = '/login';
//   }
// };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401 || result?.error?.status === 403) {
    api.dispatch(logout());
    // redirectToLogin();
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["VehicleType", "DeliveryType", "Quizzes", "Questions", "QuizResults", "UserTypes", "RiderProfiles", "StandardCommissionRate", "RaiderCompensationRole", "RaiderDeductionFee", "UserFeeStructure", "DynamicSurgePricing", "UserDynamicSurge"],
  endpoints: () => ({}),
});