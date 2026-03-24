import { baseApi } from "@/redux/api/baseApi";

const roleBasedAccessControlApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoleBasedAccessControl: builder.query({
      query: (params: { search?: string; page?: number; limit?: number } = {}) => {
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append("search", params.search);
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());

        const queryString = queryParams.toString();
        return {
          url: `/roles${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["RoleBasedAccessControl", "Users", "AdditionalServicesLogs"],
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
      providesTags: ["RoleBasedAccessControl", "Users", "AdditionalServicesLogs"],
    }),

    addRoleBasedAccessControl: builder.mutation({
      query: (data) => ({
        url: "/roles",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["RoleBasedAccessControl", "Users", "AdditionalServicesLogs"],
    }),

    updateRoleBasedAccessControl: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/roles/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["RoleBasedAccessControl", "Users", "AdditionalServicesLogs"],
    }),

    updateRoleBasedAccessControlRole: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/roles/update-role/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["RoleBasedAccessControl", "Users", "AdditionalServicesLogs"],
    }),

    updateRoleBasedAccessControlStatus: builder.mutation({
      query: (id) => ({
        url: `/roles/${id}/active-status`,
        method: "PUT",
      }),
      invalidatesTags: ["RoleBasedAccessControl", "Users", "AdditionalServicesLogs"],
    }),

    deleteRoleBasedAccessControl: builder.mutation({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RoleBasedAccessControl", "Users", "AdditionalServicesLogs"],
    }),

    getRoleUsers: builder.query({
      query: (id) => ({
        url: `/roles/${id}/users`,
        method: "GET",
      }),
      providesTags: ["RoleBasedAccessControl", "Users", "AdditionalServicesLogs"],
    }),

    removeUserFromRole: builder.mutation({
      query: ({ roleId, userId }) => ({
        url: `/roles/${roleId}/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RoleBasedAccessControl", "Users", "AdditionalServicesLogs"],
    }),
    addaddUserToRole: builder.mutation({
      query: ({ roleId, userId }) => ({
        url: `/roles/${roleId}/users/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["RoleBasedAccessControl", "Users", "AdditionalServicesLogs"],
    }),

    updateUserRole: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/roles/update-role/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["RoleBasedAccessControl", "Users", "AdditionalServicesLogs"],
    }),
  }),
});

export const {
  useGetRoleBasedAccessControlQuery,
  useGetRoleAvailablePermissionsQuery,
  useGetRoleUserPermissionsQuery,
  useAddRoleBasedAccessControlMutation,
  useUpdateRoleBasedAccessControlMutation,
  useUpdateRoleBasedAccessControlStatusMutation,
  useUpdateRoleBasedAccessControlRoleMutation,
  useDeleteRoleBasedAccessControlMutation,
  useGetRoleUsersQuery,
  useRemoveUserFromRoleMutation,
  useAddaddUserToRoleMutation,
  useUpdateUserRoleMutation
} = roleBasedAccessControlApi;
