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

    addRoleBasedAccessControl: builder.mutation({
      query: (data) => ({
        url: "/roles",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["RoleBasedAccessControl", "Users"],
    }),

    updateRoleBasedAccessControl: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/roles/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["RoleBasedAccessControl", "Users"],
    }),

    updateRoleBasedAccessControlRole: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/roles/update-role/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["RoleBasedAccessControl", "Users"],
    }),

    updateRoleBasedAccessControlStatus: builder.mutation({
      query: (id) => ({
        url: `/roles/${id}/active-status`,
        method: "PUT",
      }),
      invalidatesTags: ["RoleBasedAccessControl", "Users"],
    }),

    deleteRoleBasedAccessControl: builder.mutation({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RoleBasedAccessControl", "Users"],
    }),

    getRoleUsers: builder.query({
      query: (id) => ({
        url: `/roles/${id}/users`,
        method: "GET",
      }),
      providesTags: ["RoleBasedAccessControl", "Users"],
    }),

    removeUserFromRole: builder.mutation({
      query: ({ roleId, userId }) => ({
        url: `/roles/${roleId}/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RoleBasedAccessControl", "Users"],
    }),
    addaddUserToRole: builder.mutation({
      query: ({ roleId, userId }) => ({
        url: `/roles/${roleId}/users/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["RoleBasedAccessControl", "Users"],
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
} = roleBasedAccessControlApi;
