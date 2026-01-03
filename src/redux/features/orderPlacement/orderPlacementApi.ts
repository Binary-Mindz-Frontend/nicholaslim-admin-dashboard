/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

const orderEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint for creating a new order
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/order/indivitual",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["BulkOrders", "BulkOrdersTab"],
    }),

    exportOrdersCsv: builder.query({
      query: () => ({
        url: "/order/orders/export/csv",
        method: "GET",
        responseHandler: (response: any) => response.blob(),
      }),
    }),

    uploadBulkOrderFile: builder.mutation({
      query: (formData) => ({
        url: "/auth/upload",
        method: "POST",
        body: formData,
      }),
    }),

    bulkOrder: builder.mutation({
      query: (formData) => ({
        url: "/order/orders/bulk", // Endpoint for bulk orders
        method: "POST",
        body: formData, // Send the form data containing the CSV
      }),
      invalidatesTags: ["BulkOrders", "BulkOrdersTab"],
    }),

    getBulkOrders: builder.query({
      query: ({ page = 1, limit = 20 }) => ({
        url: `/order/bulk?page=${page}&limit=${limit}`, // Using query params for pagination
        method: "GET",
      }),
      providesTags: ["BulkOrders"],
    }),

    getBulkOrdersTab: builder.query({
      query: () => ({
        url: "/order/bulk",
        method: "GET",
      }),
      providesTags: ["BulkOrdersTab"],
    }),

    bulkOrderStatusPending: builder.mutation({
      query: ({ orderIds, payType, paymentMethod, stripePaymentMethodId }) => ({
        url: "/order/bulk/status/pending", // Assuming this is the correct URL for updating status
        method: "PATCH",
        body: {
          orderIds,
          payType,
          paymentMethod,
          stripePaymentMethodId,
        },
      }),
      invalidatesTags: ["BulkOrders", "BulkOrdersTab"],
    }),

    // orderStatus: builder.mutation({
    //   query: ({
    //     orderId,
    //     userId,
    //     status,
    //     payType,
    //     paymentMethod,
    //     paymentMethodId,
    //   }) => ({
    //     url: `/order/status/${orderId}/${userId}`,
    //     method: "PATCH",
    //     body: {
    //       status,
    //       payType,
    //       paymentMethod,
    //       paymentMethodId,
    //     },
    //   }),
    //   invalidatesTags: ["BulkOrders", "BulkOrdersTab"],
    // }),

    placeOrder: builder.mutation({
      query: ({ orderId, paymentMethod, paymentMethodId, codCollectFrom }) => ({
        url: `/order/${orderId}/place`,
        method: "POST",
        body: {
          paymentMethod,
          paymentMethodId,
          codCollectFrom,
        },
      }),
      invalidatesTags: ["BulkOrders", "BulkOrdersTab"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useLazyExportOrdersCsvQuery,
  useUploadBulkOrderFileMutation,
  useBulkOrderMutation,
  useGetBulkOrdersQuery,
  useGetBulkOrdersTabQuery,
  useBulkOrderStatusPendingMutation,
  // useOrderStatusMutation,
  usePlaceOrderMutation
} = orderEndpoints;

export default orderEndpoints;
