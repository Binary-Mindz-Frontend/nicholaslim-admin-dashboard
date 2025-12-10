import { baseApi } from "@/redux/api/baseApi";

export const incentivesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Incentive
    createIncentive: builder.mutation({
      query: (data) => ({
        url: "/api/v1/incentive",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Incentives"],
    }),

    // Get all incentives
    getAllIncentives: builder.query({
      query: () => "/api/v1/incentive",
      providesTags: ["Incentives"],
    }),

    // Get incentive by ID
    getIncentiveById: builder.query({
      query: (id) => `/api/v1/incentive/${id}`,
      providesTags: ["Incentives"],
    }),

    // Update incentive
    updateIncentive: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/api/v1/incentive/${id}`,
        method: "PATCH",
        body: rest,
      }),
      invalidatesTags: ["Incentives"],
    }),

    // Delete incentive
    deleteIncentive: builder.mutation({
      query: (id) => ({
        url: `/api/v1/incentive/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Incentives"],
    }),

    // Update incentive status
    updateIncentiveStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/v1/incentive/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Incentives"],
    }),
  }),
});

export const {
  useCreateIncentiveMutation,
  useGetAllIncentivesQuery,
  useGetIncentiveByIdQuery,
  useUpdateIncentiveMutation,
  useDeleteIncentiveMutation,
  useUpdateIncentiveStatusMutation,
} = incentivesApi;
