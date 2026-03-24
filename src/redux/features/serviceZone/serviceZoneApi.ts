import { baseApi } from "@/redux/api/baseApi";

const serviceZoneApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServiceZones: builder.query({
      query: () => ({
        url: "/service-zone",
        method: "GET",
      }),
      providesTags: ["ServiceZones", "AdditionalServicesLogs"],
    }),

    addServiceZone: builder.mutation({
      query: (data) => ({
        url: "/service-zone/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ServiceZones", "AdditionalServicesLogs"],
    }),

    updateServiceZone: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/service-zone/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["ServiceZones", "AdditionalServicesLogs"],
    }),

    updateServiceZoneStatus: builder.mutation({
      query: (id) => ({
        url: `/service-zone/update-status${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["ServiceZones", "AdditionalServicesLogs"],
    }),

    deleteServiceZone: builder.mutation({
      query: (id) => ({
        url: `/service-zone/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ServiceZones", "AdditionalServicesLogs"],
    }),
  }),
});

export const {
  useGetServiceZonesQuery,
  useAddServiceZoneMutation,
  useUpdateServiceZoneMutation,
  useUpdateServiceZoneStatusMutation,
  useDeleteServiceZoneMutation,
} = serviceZoneApi;
