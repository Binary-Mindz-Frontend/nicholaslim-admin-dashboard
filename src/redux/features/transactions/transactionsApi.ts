import { baseApi } from "@/redux/api/baseApi";

const transactionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query({
      query: (
        params: {
          page?: number;
          limit?: number;
          status?: string;
          dateFilter?: string;
        } = {}
      ) => ({
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
      providesTags: ["Transactions"],
    }),
  }),
});

export const { useGetTransactionsQuery, useGetTransactionByIdQuery } =
  transactionsApi;