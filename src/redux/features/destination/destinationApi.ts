import { baseApi } from "@/redux/api/baseApi";

const destinationEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint for creating a new destination
    createDestination: builder.mutation({
      query: (destinationData) => ({
        url: "/destination",
        method: "POST",
        body: destinationData,
      }),
      

    }),
  }),
});

export const { useCreateDestinationMutation } = destinationEndpoints;

export default destinationEndpoints;
