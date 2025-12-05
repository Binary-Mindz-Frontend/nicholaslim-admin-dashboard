import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://10.10.20.45:3000/api/v1",
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

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle unauthorized errors (401/403)
  if (result?.error?.status === 401 || result?.error?.status === 403) {
    api.dispatch(logout());
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [],
  endpoints: () => ({}),
});
