import { baseApi } from "@/redux/api/baseApi";

export const advertiseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Advertisement
    createAdvertisement: builder.mutation({
      query: (newAdvertisement) => ({
        url: "/advertise",
        method: "POST",
        body: newAdvertisement,
      }),
    }),

    // Get Advertisements
    getAdvertisements: builder.query({
      query: () => "/advertise",
    }),

    // Get Advertisement by ID
    getAdvertisementById: builder.query({
      query: (id) => `/advertise/${id}`,
    }),

    // Update Advertisement
    updateAdvertisement: builder.mutation({
      query: ({ id, ...updatedAdvertisement }) => ({
        url: `/advertise/${id}`,
        method: "PATCH",
        body: updatedAdvertisement,
      }),
    }),

    // Delete Advertisement
    deleteAdvertisement: builder.mutation({
      query: (id) => ({
        url: `/advertise/${id}`,
        method: "DELETE",
      }),
    }),

    // Update Advertisement Status
    updateStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/advertise/status/${id}`,
        method: "PATCH",
        body: { status },
      }),
    }),

    // Get Global Advertisement Stats
    getGlobalStats: builder.query({
      query: () => "/advertise/stats/global",
    }),

    // Get Stats for Single Advertisement
    getAdvertisementStats: builder.query({
      query: (id) => `/advertise/${id}/stats`,
    }),

    // Record Impression on Advertisement
    recordImpression: builder.mutation({
      query: (id) => ({
        url: `/advertise/${id}/impression`,
        method: "POST",
      }),
    }),

    // Record Click on Advertisement
    recordClick: builder.mutation({
      query: (id) => ({
        url: `/advertise/${id}/click`,
        method: "POST",
      }),
    }),
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
  useGetAdvertisementStatsQuery,
  useRecordImpressionMutation,
  useRecordClickMutation,
} = advertiseApi;
