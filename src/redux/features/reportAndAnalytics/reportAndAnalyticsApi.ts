import { baseApi } from "@/redux/api/baseApi";

const reportAndAnalyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReportAndAnalyticsStats: builder.query({
      query: () => ({
        url: "/report-and-analytics/stats",
        method: "GET",
      }),
      providesTags: ["ReportAndAnalytics"],
    }),

    getReportAndAnalytics: builder.query({
      query: () => ({
        url: "/report-and-analytics/analytics",
        method: "GET",
      }),
      providesTags: ["ReportAndAnalytics"],
    }),

    getKpiStats: builder.query({
      query: ({ from, to }) => ({
        url: "/report-and-analytics/kpi-stats",
        method: "GET",
        params: { from, to },
      }),
      providesTags: ["Kpi"],
    }),

    getCoinStats: builder.query({
      query: ({ from, to }) => ({
        url: "/report-and-analytics/coin/stats",
        method: "GET",
        params: { from, to },
      }),
      providesTags: ["Coin"],
    }),

    getIncentiveStats: builder.query({
      query: ({ from, to }) => ({
        url: "/report-and-analytics/incentive/analytics",
        method: "GET",
        params: { from, to },
      }),
      providesTags: ["Incentive"],
    }),

    getDriverPerformanceGraph: builder.query({
      query: (month) => ({
        url: "/report-and-analytics/performance",
        method: "GET",
        params: { month },
      }),
      providesTags: ["DriverPerformance"],
    }),

    getDriverPerformanceTop: builder.query({
      query: (limit) => ({
        url: "/report-and-analytics/top",
        method: "GET",
        params: { limit },
      }),
      providesTags: ["DriverPerformance"],
    }),
  }),
});

export const {
  useGetReportAndAnalyticsStatsQuery,
  useGetReportAndAnalyticsQuery,
  useGetKpiStatsQuery,
  useGetCoinStatsQuery,
  useGetIncentiveStatsQuery,
  useGetDriverPerformanceGraphQuery,
  useGetDriverPerformanceTopQuery,
} = reportAndAnalyticsApi;
