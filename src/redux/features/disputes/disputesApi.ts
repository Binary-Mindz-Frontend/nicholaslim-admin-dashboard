import { baseApi } from "@/redux/api/baseApi";

const disputesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDisputes: builder.query({
      query: (params?: {
        page?: number;
        limit?: number;
        status?: string;
        fromDate?: string;
        toDate?: string;
        disputeTypeId?: string;
        participantType?: string;
      }) => {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.status) queryParams.append("status", params.status);

        // New filter parameters
        if (params?.fromDate) queryParams.append("fromDate", params.fromDate);
        if (params?.toDate) queryParams.append("toDate", params.toDate);
        if (params?.disputeTypeId)
          queryParams.append("disputeTypeId", params.disputeTypeId);
        if (params?.participantType)
          queryParams.append("participantType", params.participantType);

        const queryString = queryParams.toString();
        return {
          url: `/disputes${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Disputes"],
    }),

    getDisputeById: builder.query({
      query: (id) => ({
        url: `/disputes/${id}`,
        method: "GET",
      }),
      providesTags: ["Disputes"],
    }),

    deleteDispute: builder.mutation({
      query: (id) => ({
        url: `/disputes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Disputes"],
    }),

    resolveDispute: builder.mutation({
      query: (resolveData: {
        disputeId: number;
        refundType: string;
        totalAmount: number;
        companyPercent: number;
        riderPercent: number;
        adminId: number;
      }) => ({
        url: "/disputes/resolve",
        method: "POST",
        body: resolveData,
      }),
      invalidatesTags: ["Disputes"],
    }),

    closeDisputeCase: builder.mutation({
      query: (id: string) => ({
        url: `/disputes/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Disputes"],
    }),
  }),
});

export const {
  useGetDisputesQuery,
  useGetDisputeByIdQuery,
  useDeleteDisputeMutation,
  useResolveDisputeMutation,
  useCloseDisputeCaseMutation,
} = disputesApi;
