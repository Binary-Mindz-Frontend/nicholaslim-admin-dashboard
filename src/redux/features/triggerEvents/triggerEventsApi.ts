import { baseApi } from "@/redux/api/baseApi";

const triggerEventsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTriggerEvents: builder.query({
      query: () => ({
        url: "/admin/trigger-events",
        method: "GET",
      }),
      providesTags: ["TriggerEvents"],
    }),

    getTriggerEventById: builder.query({
      query: (id: string) => ({
        url: `/admin/trigger-events/${id}`,
        method: "GET",
      }),
      providesTags: ["TriggerEvents"],
    }),

    createTriggerEvent: builder.mutation({
      query: (data) => ({
        url: "/admin/trigger-events",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TriggerEvents"],
    }),

    updateTriggerEvent: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/trigger-events/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["TriggerEvents"],
    }),

    deleteTriggerEvent: builder.mutation({
      query: (id: string) => ({
        url: `/admin/trigger-events/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TriggerEvents"],
    }),

    toggleTriggerEvent: builder.mutation({
      query: (id: string) => ({
        url: `/admin/trigger-events/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: ["TriggerEvents"],
    }),
  }),
});

export const {
  useGetTriggerEventsQuery,
  useGetTriggerEventByIdQuery,
  useCreateTriggerEventMutation,
  useUpdateTriggerEventMutation,
  useDeleteTriggerEventMutation,
  useToggleTriggerEventMutation,
} = triggerEventsApi;