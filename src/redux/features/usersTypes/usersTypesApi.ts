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

    // Additional mutation queries for adding, updating, and deleting users
    // addUserType, updateUserType, deleteUserType...
  }),
});

export const {
  useGetUserTypesQuery,
  useGetUserTypeByIdQuery,
} = userTypesApi;
