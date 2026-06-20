import { baseApi } from "@/redux/api/baseApi";

const notificationRulesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotificationMergeTags: builder.query({
      query: () => ({
        url: "/admin/notification-rules/merge-tags",
        method: "GET",
      }),
    }),

    createNotificationRule: builder.mutation({
      query: (data) => ({
        url: "/admin/notification-rules",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["NotificationRules"],
    }),

    getNotificationRules: builder.query({
      query: () => ({
        url: "/admin/notification-rules",
        method: "GET",
      }),
      providesTags: ["NotificationRules"],
    }),

    getNotificationRuleById: builder.query({
      query: (id) => ({
        url: `/admin/notification-rules/${id}`,
        method: "GET",
      }),
      providesTags: ["NotificationRules"],
    }),

    updateNotificationRule: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/notification-rules/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["NotificationRules"],
    }),

    deleteNotificationRule: builder.mutation({
      query: (id) => ({
        url: `/admin/notification-rules/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NotificationRules"],
    }),

    toggleNotificationRule: builder.mutation({
      query: (id) => ({
        url: `/admin/notification-rules/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: ["NotificationRules"],
    }),
  }),
});

export const {
  useGetNotificationMergeTagsQuery,
  useCreateNotificationRuleMutation,
  useGetNotificationRulesQuery,
  useGetNotificationRuleByIdQuery,
  useUpdateNotificationRuleMutation,
  useDeleteNotificationRuleMutation,
  useToggleNotificationRuleMutation,
} = notificationRulesApi;