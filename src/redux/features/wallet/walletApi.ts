import { baseApi } from "@/redux/api/baseApi";

export const walletApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Wallet with search and pagination
    getWallet: builder.query({
      query: ({ role, search, page = 1, limit = 20 }) => ({
        url: `/wallet/user/wallet`,
        method: "GET",
        params: { role, search, page, limit },
      }),
      providesTags: ["Wallets"],
    }),
    getWalletHistory: builder.query({
      query: ({ userId, page = 1, limit = 20, type }) => ({
        url: `/wallet/user/walletHistory/${userId}`,
        method: "GET",
        params: { page, limit, type },
      }),
      providesTags: ["Wallets"],
    }),
  }),

});

export const { useGetWalletQuery ,useGetWalletHistoryQuery} = walletApi;
