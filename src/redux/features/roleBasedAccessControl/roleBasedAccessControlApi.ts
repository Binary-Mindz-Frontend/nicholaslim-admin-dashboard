import { baseApi } from "@/redux/api/baseApi";

const roleBasedAccessControlApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoleBasedAccessControl: builder.query({
      query: () => ({
        url: "/roles",
        method: "GET",
      }),
      providesTags: ["RoleBasedAccessControl", "Users"],
    }),

    getRoleAvailablePermissions: builder.query({
      query: () => ({
        url: "/roles/available-permissions",
        method: "GET",
      }),
      providesTags: ["RoleBasedAccessControl", "Users"],
    }),

    getRoleUserPermissions: builder.query({
      query: () => ({
        url: "/roles/user/permissions",
        method: "GET",
      }),
      providesTags: ["RoleBasedAccessControl", "Users"],
    }),

    updateRoleBasedAccessControl: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/roles/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["RoleBasedAccessControl", "Users"],
    }),
  }),
});

export const {
  useGetRoleBasedAccessControlQuery,
  useGetRoleAvailablePermissionsQuery,
  useGetRoleUserPermissionsQuery,
  useUpdateRoleBasedAccessControlMutation,
} = roleBasedAccessControlApi;
