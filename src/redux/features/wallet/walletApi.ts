import { baseApi } from "@/redux/api/baseApi";

export const walletApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Wallet with search and pagination
    userGetWallet: builder.query({
      query: ({ role, search, page, limit, balanceSort }) => ({
        url: `/wallet/user/wallet`,
        method: "GET",
        params: { role, search, page, limit, balanceSort },
      }),
      providesTags: ["Wallets"],
    }),
    userGetWalletAdmin: builder.query({
      query: ({ role, search, page, limit, balanceSort }) => ({
        url: `/wallet/user/wallet/admin`,
        method: "GET",
        params: { role, search, page, limit, balanceSort },
      }),
      providesTags: ["Wallets"],
    }),
    raiderGetWallet: builder.query({
      query: ({ role, search, page, limit, balanceSort }) => ({
        url: `/wallet/raider/wallet`,
        method: "GET",
        params: { role, search, page, limit, balanceSort },
      }),
      providesTags: ["Wallets"],
    }),

    raiderGetWalletAdmin: builder.query({
      query: ({ role, search, page, limit, balanceSort }) => ({
        url: `/wallet/raider/wallet/admin`,
        method: "GET",
        params: { role, search, page, limit, balanceSort },
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

    //  Get Wallet Cards
    getWalletCards: builder.query({
      query: () => ({
        url: `/wallet/wallet/cards`,
        method: "GET",
      }),
      providesTags: ["Wallets"],
    }),
    //  Wallet Pay API (POST)
    walletPay: builder.mutation({
      query: (payload) => ({
        url: `/wallet/wallet/pay`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Wallets"],
    }),
    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `/wallet/remove/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wallets"],
    }),
  }),
});

export const {
  useUserGetWalletQuery,
  useRaiderGetWalletQuery,
  useUserGetWalletAdminQuery,
  useRaiderGetWalletAdminQuery,
  useGetWalletHistoryQuery,
  useGetWalletCardsQuery,
  useWalletPayMutation,
  useDeleteTransactionMutation,
} = walletApi;
