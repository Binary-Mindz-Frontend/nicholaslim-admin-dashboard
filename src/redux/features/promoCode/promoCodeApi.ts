import { baseApi } from "@/redux/api/baseApi";

const promoCodeApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getPromoCodes: builder.query({
      query: () => ({
        url: "/promo-codes",
        method: "GET",
      }),
      providesTags: ["PromoCodes"],
    }),

    getPromoCodeById: builder.query({
      query: (id) => ({
        url: `/promo-codes/${id}`,
        method: "GET",
      }),
      providesTags: ["PromoCodes"],
    }),

    addPromoCode: builder.mutation({
      query: (data) => ({
        url: "/promo-codes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PromoCodes"],
    }),

    updatePromoCode: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/promo-codes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["PromoCodes"],
    }),

    deletePromoCode: builder.mutation({
      query: (id) => ({
        url: `/promo-codes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PromoCodes"],
    }),
  }),
});

export const {
  useGetPromoCodesQuery,
  useGetPromoCodeByIdQuery,
  useAddPromoCodeMutation,
  useUpdatePromoCodeMutation,
  useDeletePromoCodeMutation,
} = promoCodeApi;
