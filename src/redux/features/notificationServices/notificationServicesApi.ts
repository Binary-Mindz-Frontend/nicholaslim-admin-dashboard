import { baseApi } from "@/redux/api/baseApi";

const notificationServicesApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (build) => ({
    addNotification: build.mutation<any, any>({
      query: (data) => ({
        url: "/notifications/admin/notification",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Notification"],
    }),

    addNotificationPromotion: build.mutation<any, any>({
      query: (data) => ({
        url: "/notifications/admin/promotion",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Notification"],
    }),

    getNotificationsList: build.query<any, any>({
      query: (body) => ({
        url: "/notifications/admin/list",
        method: "GET",
        params: body,
      }),
      providesTags: ["Notification"],
    }),

    getNotificationLogs: build.query<any, any>({
      query: (params) => ({
        url: "/notifications/admin/logs",
        method: "GET",
        params: params,
      }),
      providesTags: ["Notification"],
    }),

    getNotificationAnalytics: build.query<any, any>({
      query: (params) => ({
        url: "/notifications/admin/analytics",
        method: "GET",
        params,
      }),
      providesTags: ["Notification"],
    }),

    updateNotification: build.mutation<any, any>({
      query: ({ id, ...data }) => ({
        url: `/notifications/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Notification"],
    }),

    resendNotification: build.mutation<any, { id: string | number; channels?: string[] }>({
      query: ({ id, channels }) => ({
        url: `/notifications/${id}/resend`,
        method: "POST",
        body: { channels },
      }),
      invalidatesTags: ["Notification"],
    }),

    cancelScheduledNotification: build.mutation<any, string | number>({
      query: (id) => ({
        url: `/notifications/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    deleteNotification: build.mutation<any, any>({
      query: (id) => ({
        url: `/notifications/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),

    bulkDeleteNotifications: build.mutation<any, { ids: (string | number)[] }>({
      query: (data) => ({
        url: "/notifications/admin/bulk-delete",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useAddNotificationMutation,
  useAddNotificationPromotionMutation,
  useGetNotificationsListQuery,
  useGetNotificationLogsQuery,
  useGetNotificationAnalyticsQuery,
  useUpdateNotificationMutation,
  useResendNotificationMutation,
  useCancelScheduledNotificationMutation,
  useDeleteNotificationMutation,
  useBulkDeleteNotificationsMutation,
} = notificationServicesApi;

