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

    getKpiStats: builder.query({
      query: ({ from, to }) => ({
        url: "/report-and-analytics/kpi-stats",
        method: "GET",
        params: { from, to },
      }),
    }),

    getCoinStats: builder.query({
      query: ({ from, to }) => ({
        url: "/report-and-analytics/coin/stats",
        method: "GET",
        params: { from, to },
      }),
    }),
  }),
});

export const {
  useGetReportAndAnalyticsStatsQuery,
  useGetReportAndAnalyticsQuery,
  useGetKpiStatsQuery,
  useGetCoinStatsQuery,
} = reportAndAnalyticsApi;