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
  }),
});

export const { useAddNotificationMutation } = notificationServicesApi;
