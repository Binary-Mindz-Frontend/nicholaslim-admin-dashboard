import { baseApi } from "@/redux/api/baseApi";

const notificationServicesApi = baseApi.injectEndpoints({
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

    updateNotification: build.mutation<any, any>({
      query: ({ id, ...data }) => ({
        url: `/notifications/admin/${id}`,
        method: "PATCH",
        body: data,
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
  }),
});

export const {
  useAddNotificationMutation,
  useAddNotificationPromotionMutation,
  useGetNotificationsListQuery,
  useGetNotificationLogsQuery,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
} = notificationServicesApi;
