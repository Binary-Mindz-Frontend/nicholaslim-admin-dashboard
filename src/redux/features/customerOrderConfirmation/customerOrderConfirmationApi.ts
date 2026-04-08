import { baseApi } from "@/redux/api/baseApi";

const customerOrderConfirmationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCustomerOrderConfirmation: build.query({
      query: () => ({
        url: `/customer-order-confirmation`,
        method: "GET",
      }),
      providesTags: ["CustomerOrderConfirmation"],
    }),

    getCustomerOrderConfirmationStatus: build.query({
      query: () => ({
        url: `/customer-order-confirmation/stats`,
        method: "GET",
      }),
      providesTags: ["CustomerOrderConfirmation"],
    }),

    getCustomerOrderConfirmationById: build.query({
      query: (id) => ({
        url: `/customer-order-confirmation/${id}`,
        method: "GET",
      }),
      providesTags: ["CustomerOrderConfirmation"],
    }),

    getCustomeOrderConfirmationLogs: build.query({
      query: (query) => ({
        url: `/customer-order-confirmation/logs`,
        method: "GET",
        params: query,
      }),
      providesTags: ["CustomerOrderConfirmation"],
    }),

    updateCustomerOrderConfirmation: build.mutation({
      query: ({ id, data }) => ({
        url: `/customer-order-confirmation/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CustomerOrderConfirmation"],
    }),
  }),
});

export const {
  useGetCustomerOrderConfirmationQuery,
  useGetCustomerOrderConfirmationStatusQuery,
  useGetCustomerOrderConfirmationByIdQuery,
  useGetCustomeOrderConfirmationLogsQuery,
  useUpdateCustomerOrderConfirmationMutation,
} = customerOrderConfirmationApi;
