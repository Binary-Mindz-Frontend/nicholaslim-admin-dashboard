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
      providesTags: ["UserTypes"],
    }),
  }),
});

export const {
  useGetUserTypesQuery,
  useGetUserTypeByIdQuery,
  useDeleteUserTypeMutation,
  useToggleUserActiveStatusMutation,
  useUpdateUserTypeMutation,
  useAddUserTypeMutation,
  useGetUserProfileQuery,
} = userTypesApi;
