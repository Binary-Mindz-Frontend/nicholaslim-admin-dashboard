import { baseApi } from "@/redux/api/baseApi";

const reportAndAnalyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReportAndAnalyticsStats: builder.query({
      query: () => ({
        url: "/report-and-analytics/stats",
        method: "GET",
      }),
    }),

    getReportAndAnalytics: builder.query({
      query: () => ({
        url: "/report-and-analytics/analytics",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetReportAndAnalyticsStatsQuery,
  useGetReportAndAnalyticsQuery,
} = reportAndAnalyticsApi;
