import { baseApi } from "@/redux/api/baseApi";

const reportAndAnalyticsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getReportAndAnalytics: builder.query({
            query: () => ({
                url: '/report-and-analytics/stats',
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetReportAndAnalyticsQuery } = reportAndAnalyticsApi;