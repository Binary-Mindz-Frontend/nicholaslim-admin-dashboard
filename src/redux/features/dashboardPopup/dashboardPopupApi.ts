import { baseApi } from "@/redux/api/baseApi";

const dashboardPopupApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getDashboardPopups: builder.query({
      query: () => ({
        url: "/dashboard-popup",
        method: "GET",
      }),
      providesTags: ["DashboardPopup"],
    }),

    getDashboardPopupById: builder.query({
      query: (id) => ({
        url: `/dashboard-popup/${id}`,
        method: "GET",
      }),
      providesTags: ["DashboardPopup"],
    }),

    addDashboardPopup: builder.mutation({
      query: (data) => ({
        url: "/dashboard-popup",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["DashboardPopup"],
    }),

    updateDashboardPopup: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/dashboard-popup/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["DashboardPopup"],
    }),

    deleteDashboardPopup: builder.mutation({
      query: (id) => ({
        url: `/dashboard-popup/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DashboardPopup"],
    }),
  }),
});

export const {
  useGetDashboardPopupsQuery,
  useGetDashboardPopupByIdQuery,
  useAddDashboardPopupMutation,
  useUpdateDashboardPopupMutation,
  useDeleteDashboardPopupMutation,
} = dashboardPopupApi;
