import { baseApi } from "@/redux/api/baseApi";

const standardCommissionRateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStandardCommissionRate: builder.query({
      query: () => ({
        url: "/standard-commission-rate",
        method: "GET",
      }),
      providesTags: ["StandardCommissionRate"],
    }),

    singleStandardCommissionRate: builder.query({
      query: (id) => ({
        url: `/standard-commission-rate/${id}`,
        method: "GET",
      }),
      providesTags: ["StandardCommissionRate"],
    }),

    addStandardCommissionRate: builder.mutation({
      query: (data) => ({
        url: "/standard-commission-rate",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["StandardCommissionRate"],
    }),

    updateStandardCommissionRate: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/standard-commission-rate/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["StandardCommissionRate"],
    }),

    deleteStandardCommissionRate: builder.mutation({
      query: (id) => ({
        url: `/standard-commission-rate/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["StandardCommissionRate"],
    }),

    getAllStandardCommissionRateLogs: builder.query({
      query: (body) => ({
        url: "/standard-commission-rate/logs",
        method: "GET",
        params: body,
      }),
      providesTags: ["StandardCommissionRate"],
    }),
  }),
});

export const {
  useGetStandardCommissionRateQuery,
  useSingleStandardCommissionRateQuery,
  useAddStandardCommissionRateMutation,
  useUpdateStandardCommissionRateMutation,
  useDeleteStandardCommissionRateMutation,
  useGetAllStandardCommissionRateLogsQuery,
} = standardCommissionRateApi;
