import { baseApi } from "@/redux/api/baseApi";

const surgePricingRulesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getSurgePricingRules: builder.query({
      query: ({
        page = 1,
        limit = 10,
        status,
        serviceZoneId,
        deliveryTypeId,
      }: { page?: number; limit?: number; status?: string; serviceZoneId?: string; deliveryTypeId?: string }) => ({
        url: "/admin/surge-pricing-rules",
        method: "GET",
        params: {
          page,
          limit,
          status,
          serviceZoneId,
          deliveryTypeId,
        },
      }),
      providesTags: ["SurgePricingRules"],
    }),

    getSurgePricingRuleById: builder.query({
      query: (id) => ({
        url: `/admin/surge-pricing-rules/${id}`,
        method: "GET",
      }),
      providesTags: ["SurgePricingRules"],
    }),

    createSurgePricingRule: builder.mutation({
      query: (body) => ({
        url: "/admin/surge-pricing-rules",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SurgePricingRules"],
    }),

    updateSurgePricingRule: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/surge-pricing-rules/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["SurgePricingRules"],
    }),

    deleteSurgePricingRule: builder.mutation({
      query: (id) => ({
        url: `/admin/surge-pricing-rules/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SurgePricingRules"],
    }),

    toggleSurgePricingRuleStatus: builder.mutation({
      query: (id) => ({
        url: `/admin/surge-pricing-rules/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: ["SurgePricingRules"],
    }),

  }),
});

export const {
  useGetSurgePricingRulesQuery,
  useGetSurgePricingRuleByIdQuery,
  useCreateSurgePricingRuleMutation,
  useUpdateSurgePricingRuleMutation,
  useDeleteSurgePricingRuleMutation,
  useToggleSurgePricingRuleStatusMutation,
} = surgePricingRulesApi;