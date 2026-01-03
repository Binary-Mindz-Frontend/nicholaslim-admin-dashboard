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
      query: ({id, ...data}) => ({
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
} = roleBasedAccessControlApi;
