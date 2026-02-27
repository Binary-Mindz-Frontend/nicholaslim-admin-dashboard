import { baseApi } from "@/redux/api/baseApi";

export const incentivesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Incentive
    createIncentive: builder.mutation({
      query: (data) => ({
        url: "/incentive",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Incentives"],
    }),

    // Get all incentives
    // getAllIncentives: builder.query({
    //   query: () => "/incentive/admin",
    //   providesTags: ["Incentives"],
    // }),
    getAllIncentives: builder.query({
      query: ({ page, limit }) => ({
        url: "/incentive/admin",
        params: { page, limit },
      }),
      providesTags: ["Incentives"],
    }),

    getAllIncentiveStats: builder.query({
      query: () => "/incentive/stats",
      providesTags: ["Incentives"],
    }),

    // Get incentive by ID
    getIncentiveById: builder.query({
      query: (id) => `/incentive/${id}`,
      providesTags: ["Incentives"],
    }),

    // Update incentive
    updateIncentive: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/incentive/${id}`,
        method: "PATCH",
        body: rest,
      }),
      invalidatesTags: ["Incentives"],
    }),

    // Delete incentive
    deleteIncentive: builder.mutation({
      query: (id) => ({
        url: `/incentive/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Incentives"],
    }),

    // Update incentive status
    updateIncentiveStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/incentive/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Incentives"],
    }),

    getAllIncentiveLogs: builder.query({
      query: (params) => ({
        url: "/incentive/logs",
        method: "GET",
        params,
      }),
      providesTags: ["Incentives"],
    }),
  }),
});

export const {
  useCreateIncentiveMutation,
  useGetAllIncentivesQuery,
  useGetAllIncentiveStatsQuery,
  useGetIncentiveByIdQuery,
  useUpdateIncentiveMutation,
  useDeleteIncentiveMutation,
  useUpdateIncentiveStatusMutation,
  useGetAllIncentiveLogsQuery,
} = incentivesApi;
