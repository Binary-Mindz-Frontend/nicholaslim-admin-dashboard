import { baseApi } from "@/redux/api/baseApi";

const driverTiersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDriverTiers: builder.query({
      query: () => ({
        url: "/admin/driver-tiers",
        method: "GET",
      }),
      providesTags: ["DriverTiers"],
    }),

    getDriverTiersById: builder.query({
      query: (id) => ({
        url: `/admin/driver-tiers/${id}`,
        method: "GET",
      }),
      providesTags: ["DriverTiers"],
    }),

    updateDriverTiers: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/driver-tiers/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["DriverTiers"],
    })
  }),
});

export const {
  useGetDriverTiersQuery,
  useGetDriverTiersByIdQuery,
  useUpdateDriverTiersMutation,
} = driverTiersApi;