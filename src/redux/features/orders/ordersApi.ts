import { baseApi } from "@/redux/api/baseApi";

const driverOrdersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDriverOrders: builder.query({
            query: ({
                page = 1,
                limit = 20,
                startDate,
                endDate,
                status,
                category,
                search,
            }) => {
                // Construct the base URL with default pagination
                let url = `/order?page=${page}&limit=${limit}`;

                // Add additional query parameters if they exist (Matching Driver API style)
                if (startDate) {
                    url += `&startDate=${startDate}`;
                }
                if (endDate) {
                    url += `&endDate=${endDate}`;
                }
                if (status) {
                    url += `&status=${status}`;
                }
                if (category) {
                    url += `&category=${category}`;
                }
                if (search) {
                    // Use encodeURIComponent for search terms to handle spaces/special chars
                    url += `&search=${encodeURIComponent(search)}`;
                }

                return {
                    url, // Use the manually constructed URL string
                    method: "GET",
                };
            },
            providesTags: ["Orders"],
        }),
    }),
});

export const {
    useGetDriverOrdersQuery,
} = driverOrdersApi;