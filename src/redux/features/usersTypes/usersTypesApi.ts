import { baseApi } from "@/redux/api/baseApi";

const userTypesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserTypes: builder.query({
      query: ({
        status,
        dateFilter,
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "asc",
      }) => {

        let url = `/users?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;

        if (status) url += `&status=${status}`;

        if (dateFilter) {
          url += `&dateFilter=${dateFilter}`;
        }

        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["UserTypes"],
    }),

    getOnlyUserTypes: builder.query({
      query: ({
        status,
        dateFilter,
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "asc",
      }) => {

        let url = `/users/only-users?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;

        if (status) url += `&status=${status}`;

        if (dateFilter) {
          url += `&dateFilter=${dateFilter}`;
        }

        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["UserTypes"],
    }),

    getWebUserTypes: builder.query({
      query: ({
        status,
        dateFilter,
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "asc",
      }) => {

        let url = `/users/web-portal?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;

        if (status) url += `&status=${status}`;

        if (dateFilter) {
          url += `&dateFilter=${dateFilter}`;
        }

        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["UserTypes"],
    }),

    // Query to get user by ID
    getUserTypeById: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: ["UserTypes"],
    }),

    // Mutation to permanently delete user(s) by ID(s)
    deleteUserType: builder.mutation({
      query: (ids) => ({
        url: `/users/permanent`,
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["UserTypes"],
    }),

    // Mutation to toggle active status
    toggleUserActiveStatus: builder.mutation({
      query: (id) => ({
        url: `/users/active/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["UserTypes"],
    }),

    // Mutation to update a user by ID using PATCH
    updateUserType: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: updatedData,
      }),

      invalidatesTags: (_, __, { id }) => [
        "UserTypes",
        { type: "UserTypes", id },
      ],
    }),

    //UPDATED Mutation to add a user (Admin Create User)
    addUserType: builder.mutation({
      query: (newUser) => ({
        url: `/users/admin/create-user`,
        method: "POST",
        body: newUser,
      }),

      invalidatesTags: ["UserTypes"],
    }),

    getUserProfile: builder.query({
      query: () => ({
        url: `users/me`,
        method: "GET",
      }),
      providesTags: ["UserTypes", "Stripe"],
    }),

    updateUserProfile: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["UserTypes"],
    }),

    // Image upload mutation
    uploadFile: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("images", file); // MUST be "images"

        return {
          url: "/auth/upload",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["UserTypes"],
    }),

    checkUsername: builder.query({
      query: (username) => ({
        url: `/users/check-username?username=${username}`,
        method: "GET",
      }),
    }),

  }),
});

export const {
  useGetUserTypesQuery,
  useGetOnlyUserTypesQuery,
  useGetWebUserTypesQuery,
  useGetUserTypeByIdQuery,
  useDeleteUserTypeMutation,
  useToggleUserActiveStatusMutation,
  useUpdateUserTypeMutation,
  useAddUserTypeMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUploadFileMutation,
  useLazyCheckUsernameQuery,
} = userTypesApi;
