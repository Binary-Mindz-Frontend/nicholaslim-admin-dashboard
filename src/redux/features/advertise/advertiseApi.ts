/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export const advertiseApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // Create Advertisement
    createAdvertisement: builder.mutation({
      query: (newAdvertisement) => ({
        url: "/advertise",
        method: "POST",
        body: newAdvertisement,
      }),
      invalidatesTags: ["Advertisements"],
    }),

    // Get Advertisements
    getAdvertisements: builder.query({
      query: () => "/advertise",
      providesTags: ["Advertisements"],
    }),

    // Get Advertisement by ID
    getAdvertisementById: builder.query({
      query: (id) => `/advertise/${id}`,
      providesTags: ["Advertisements"],
    }),

    // Update Advertisement
    updateAdvertisement: builder.mutation({
      query: ({ id, ...updatedAdvertisement }) => ({
        url: `/advertise/${id}`,
        method: "PATCH",
        body: updatedAdvertisement,
      }),
      invalidatesTags: ["Advertisements"],
    }),

    // Delete Advertisement
    deleteAdvertisement: builder.mutation({
      query: (id) => ({
        url: `/advertise/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        "Advertisements"
      ],
    }),

    // Update Advertisement Status
    updateStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/advertise/status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: [
        "Advertisements"
      ],
    }),

    // Get Global / Individual Advertisement Stats
    getGlobalStats: builder.query<
      any,
      { role?: "USER" | "RAIDER"; advertiseId?: string | number }
    >({
      query: ({ role, advertiseId }) => {
        const params: any = {};
        if (role) params.role = role;
        if (advertiseId && advertiseId !== "ALL") {
          params.advertiseId = advertiseId;
        }
        return {
          url: "/advertise/stats/global",
          method: "GET",
          params,
        };
      },
      providesTags: ["Advertisements"],
    }),

    getPerformanceTrends: builder.query<
      any,
      { role?: "USER" | "RAIDER"; months?: number; advertiseId?: string | number }
    >({
      query: ({ role, months, advertiseId }) => {
        const params: any = {};
        if (role) params.role = role;
        if (months) params.months = months;
        if (advertiseId && advertiseId !== "ALL") {
          params.advertiseId = advertiseId;
        }
        return {
          url: "/advertise/stats/performance-trends",
          method: "GET",
          params,
        };
      },
      providesTags: ["Advertisements"],
    }),

    // Get Stats for Single Advertisement
    getAdvertisementStats: builder.query<
      any,
      string | number | { id: string | number; months?: number }
    >({
      query: (arg) => {
        if (typeof arg === "object" && arg !== null) {
          return {
            url: `/advertise/${arg.id}/stats`,
            params: arg.months ? { months: arg.months } : undefined,
          };
        }
        return `/advertise/${arg}/stats`;
      },
      providesTags: ["Advertisements"],
    }),

    // Record Impression on Advertisement
    recordImpression: builder.mutation({
      query: (id) => ({
        url: `/advertise/${id}/impression`,
        method: "POST",
      }),
      invalidatesTags: ["Advertisements"],
    }),

    // Record Click on Advertisement
    recordClick: builder.mutation({
      query: (id) => ({
        url: `/advertise/${id}/click`,
        method: "POST",
      }),
      invalidatesTags: ["Advertisements"],
    }),

    getAllAdvertisesLogs: builder.query({
      query: (query) => ({
        url: "/advertise/logs",
        method: "GET",
        params: query
      }),
      providesTags: ["Advertisements"],
    })
  }),
});

export const {
  useCreateAdvertisementMutation,
  useGetAdvertisementsQuery,
  useGetAdvertisementByIdQuery,
  useUpdateAdvertisementMutation,
  useDeleteAdvertisementMutation,
  useUpdateStatusMutation,
  useGetGlobalStatsQuery,
  useGetPerformanceTrendsQuery,
  useGetAdvertisementStatsQuery,
  useRecordImpressionMutation,
  useRecordClickMutation,
  useGetAllAdvertisesLogsQuery
} = advertiseApi;
