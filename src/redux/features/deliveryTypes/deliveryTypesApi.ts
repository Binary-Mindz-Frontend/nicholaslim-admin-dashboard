import { baseApi } from "@/redux/api/baseApi";

const deliveryTypesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDeliveryTypes: builder.query({
      query: () => ({
        url: "/delivery-types",
        method: "GET",
      }),
      providesTags: ["DeliveryType", "AdditionalServicesLogs"],
    }),
    getDeliveryTypeById: builder.query({
      query: (id) => ({
        url: `/delivery-types/${id}`,
        method: "GET",
      }),
      providesTags: ["DeliveryType", "AdditionalServicesLogs"],
    }),
    addDeliveryType: builder.mutation({
      query: (data) => ({
        url: "/delivery-types/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["DeliveryType", "AdditionalServicesLogs"],
    }),
    updateDeliveryType: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/delivery-types/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["DeliveryType", "AdditionalServicesLogs"],
    }),
    deleteDeliveryType: builder.mutation({
      query: (id) => ({
        url: `/delivery-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DeliveryType", "AdditionalServicesLogs"],
    }),
  }),
});

export const {
  useGetDeliveryTypesQuery,
  useGetDeliveryTypeByIdQuery,
  useAddDeliveryTypeMutation,
  useUpdateDeliveryTypeMutation,
  useDeleteDeliveryTypeMutation,
} = deliveryTypesApi;
