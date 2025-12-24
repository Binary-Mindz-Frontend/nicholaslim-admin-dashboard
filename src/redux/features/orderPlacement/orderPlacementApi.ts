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
    }),

  }),
});

export const { useCreateOrderMutation } = orderEndpoints;

export default orderEndpoints;
