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
        // Additional mutation queries for adding, updating, and deleting users
        // addUserType, updateUserType, deleteUserType...
    }),
});

export const {
    useGetUserTypesQuery,
    useGetUserTypeByIdQuery,
    useDeleteUserTypeMutation,
    useToggleUserActiveStatusMutation,
} = userTypesApi;
