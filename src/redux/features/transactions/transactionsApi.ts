// redux/features/transactions/transactionsApi.ts
import { baseApi } from "@/redux/api/baseApi";

const transactionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query({
      query: (params: { page?: number; limit?: number; status?: string; dateFilter?: string } = {}) => ({
        url: "/transactions",
        method: "GET",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          status: params.status || "all",
          dateFilter: params.dateFilter || "today",
        },
      }),
      providesTags: ["Transactions"],
    }),

    getTransactionById: builder.query({
      query: (id: string | number) => ({
        url: `/transactions/${id}`,
        method: "GET",
      }),
      providesTags: (id) => [{ type: "Transactions", id }],
    }),

    getTransactionStats: builder.query({
      query: () => ({
        url: "/transactions/stats",
        method: "GET",
      }),
      providesTags: ["Transactions"],
    }),

    getTransactionGraph: builder.query({
      query: (year: string = "2025") => ({
        url: "/transactions/graph",
        method: "GET",
        params: { year },
      }),
      providesTags: ["Transactions"],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useGetTransactionStatsQuery,
  useGetTransactionGraphQuery,
} = transactionsApi;