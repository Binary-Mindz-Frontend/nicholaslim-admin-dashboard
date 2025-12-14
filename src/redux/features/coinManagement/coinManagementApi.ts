import { baseApi } from "@/redux/api/baseApi";

const coinManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCoins: builder.query({
      query: () => ({
        url: "/coin-management",
        method: "GET",
      }),
      providesTags: ["Coins"],
    }),

    addCoin: builder.mutation({
      query: (data) => ({
        url: "/coin-management",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Coins"],
    }),

    updateCoin: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/coin-management/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Coins"],
    }),

    deleteCoin: builder.mutation({
      query: (id) => ({
        url: `/coin-management/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coins"],
    }),
  }),
});

export const { 
  useGetCoinsQuery,
  useAddCoinMutation,
  useUpdateCoinMutation,
  useDeleteCoinMutation
 } = coinManagementApi;
