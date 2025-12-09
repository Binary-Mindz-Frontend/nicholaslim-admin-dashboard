import { baseApi } from "@/redux/api/baseApi";

const userTypesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserTypes: builder.query({
            query: ({ status, dateFilter, page = 1, limit = 10, sortBy = "createdAt", sortOrder = "asc" }) => {
                // Construct the URL with the provided query parameters
                let url = `/users?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;

                // Add status filter (active, inactive, etc.)
                if (status) url += `&status=${status}`;

                // Add date filter (yesterday, last7days, etc.)
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
                url: `/users/permanent`,  // Updated URL for permanent deletion
                method: "DELETE",
                body: { ids },  // Send the "ids" array in the request body
            }),
            invalidatesTags: ["UserTypes"],
        }),

        // Mutation to toggle active status
        toggleUserActiveStatus: builder.mutation({
            query: (id) => ({
                url: `/users/active/${id}`,
                method: "PATCH", // or "PUT" depending on your backend
            }),
            invalidatesTags: ["UserTypes"], // Refetch users after toggle
        }),

        // Mutation to update a user by ID using PATCH
        updateUserType: builder.mutation({
            query: ({ id, updatedData }) => ({
                url: `/users/${id}`,
                method: "PATCH",
                body: updatedData, // Send the fields to be updated in the request body
            }),
            // Invalidate the 'UserTypes' tag to refetch the list and the specific user's details
            invalidatesTags: (_, __, { id }) => [
                "UserTypes",
                { type: "UserTypes", id }
            ],
        }),

        // 🚀 UPDATED Mutation to add a user (Admin Create User)
        addUserType: builder.mutation({
            query: (newUser) => ({
                // 👈 Changed URL from /auth/signup to /users/admin/create-user
                url: `/users/admin/create-user`,
                method: "POST",
                body: newUser, // Expects { username, email, phone, password, role }
            }),
            // Invalidate the 'UserTypes' tag to refetch the main list of users
            invalidatesTags: ["UserTypes"],
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
} = userTypesApi;
