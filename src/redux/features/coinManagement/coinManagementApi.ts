// coinManagementApi.ts
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

    getCoinsBasePrice: builder.query({
      query: () => ({
        url: "/coin-management/base-price",
        method: "GET",
      }),
      providesTags: ["Coins"],
    }),

    getAllUsersCoinsHistory: builder.query({
      query: (params: { username?: string }) => ({
        url: "/coin-management/coin-accounts",
        method: "GET",
        params: params,
      }),
      providesTags: ["Coins"],
    }),

    getUserCoinHistoryById: builder.query({
      query: (id) => ({
        url: `/coin-management/coin-acc-history/${id}`,
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

    redeemCoin: builder.mutation<
      { success: boolean; message: string },
      { coin: string }
    >({
      query: ({ coin }) => ({
        url: "/coin-management/redeem-coin",
        method: "POST",
        params: {
          coin,
        },
      }),
      invalidatesTags: ["Coins", "UserTypes", "Stripe"],
    }),

    getCoinLogs: builder.query({
      query: (params) => ({
        url: "/coin-management/logs",
        method: "GET",
        params,
      }),
      providesTags: ["Coins"],
    }),

    getCoinBasePrice: builder.query({
      query: () => ({
        url: "/coin-management/base-price",
        method: "GET",
      }),
      providesTags: ["Coins"],
    }),

    createCoinGift: builder.mutation({
      query: (data) => ({
        url: "/coin-management/gift",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Coins"],
    }),
  }),
});

export const {
  useGetCoinsQuery,
  useGetCoinsBasePriceQuery,
  useGetAllUsersCoinsHistoryQuery,
  useGetUserCoinHistoryByIdQuery,
  useAddCoinMutation,
  useUpdateCoinMutation,
  useDeleteCoinMutation,
  useRedeemCoinMutation,
  useGetCoinLogsQuery,
  useGetCoinBasePriceQuery,
  useCreateCoinGiftMutation,
} = coinManagementApi;
