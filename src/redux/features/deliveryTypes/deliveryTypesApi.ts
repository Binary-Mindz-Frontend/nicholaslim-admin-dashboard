import { baseApi } from "@/redux/api/baseApi";

const deliveryTypesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDeliveryTypes: builder.query({
      query: () => ({
        url: "/delivery-types",
        method: "GET",
      }),
      providesTags: ["DeliveryType"],
    }),
    getDeliveryTypeById: builder.query({
      query: (id) => ({
        url: `/delivery-types/${id}`,
        method: "GET",
      }),
      providesTags: ["DeliveryType"],
    }),
    addDeliveryType: builder.mutation({
      query: (data) => ({
        url: "/delivery-types/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["DeliveryType"],
    }),
    updateDeliveryType: builder.mutation({
      query: (data) => ({
        url: `/delivery-types/${data.id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["DeliveryType"],
    }),
    deleteDeliveryType: builder.mutation({
      query: (id) => ({
        url: `/delivery-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DeliveryType"],
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
