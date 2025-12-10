import { baseApi } from "@/redux/api/baseApi";

const raiderDeductionFeeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRaiderDeductionFee: builder.query({
            query: () => ({
                url: "/raider-deduction-fee",
                method: "GET",
            }),
            providesTags: ["RaiderDeductionFee"],
        }),

        singleRaiderDeductionFee: builder.query({
            query: (id) => ({
                url: `/raider-deduction-fee/${id}`,
                method: "GET",
            }),
            providesTags: ["RaiderDeductionFee"],
        }),

        addRaiderDeductionFee: builder.mutation({
            query: (data) => ({
                url: "/raider-deduction-fee",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["RaiderDeductionFee"],
        }),

        updateRaiderDeductionFee: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/raider-deduction-fee/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["RaiderDeductionFee"],
        }),

        deleteRaiderDeductionFee: builder.mutation({
            query: (id) => ({
                url: `/raider-deduction-fee/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["RaiderDeductionFee"],
        }),
    }),
});

export const {
    useGetRaiderDeductionFeeQuery,
    useSingleRaiderDeductionFeeQuery,
    useAddRaiderDeductionFeeMutation,
    useUpdateRaiderDeductionFeeMutation,
    useDeleteRaiderDeductionFeeMutation,
} = raiderDeductionFeeApi;