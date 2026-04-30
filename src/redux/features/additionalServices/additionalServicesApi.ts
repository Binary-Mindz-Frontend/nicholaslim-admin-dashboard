import { baseApi } from "@/redux/api/baseApi";

const additionalServicesApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getAdditionalServices: builder.query({
      query: () => ({
        url: "/additional-services",
        method: "GET",
      }),
      providesTags: ["AdditionalServices"],
    }),

    getAdditionalServiceById: builder.query({
      query: (id) => ({
        url: `/additional-services/${id}`,
        method: "GET",
      }),
      providesTags: ["AdditionalServices"],
    }),

    addAdditionalService: builder.mutation({
      query: (data) => ({
        url: "/additional-services",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AdditionalServices"],
    }),

    updateAdditionalService: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/additional-services/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["AdditionalServices"],
    }),

    deleteAdditionalService: builder.mutation({
      query: (id) => ({
        url: `/additional-services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdditionalServices"],
    }),

    getServiceEmailNumber: builder.query({
      query: () => ({
        url: "/additional-services/service-email-number",
        method: "GET",
      }),
      providesTags: ["ServiceEmailNumber"],
    }),

    updateServiceEmailNumber: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/additional-services/service-email-number/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ServiceEmailNumber"],
    }),

    deleteServiceEmailNumber: builder.mutation({
      query: (id) => ({
        url: `/additional-services/service-email-number/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ServiceEmailNumber"],
    }),

    getAdditionalServicesLogs: builder.query({
      query: (query) => ({
        url: "/additional-services/logs",
        method: "GET",
        params: query,
      }),
      providesTags: [
        "VehicleType",
        "DeliveryType",
        "Quizzes",
        "Questions",
        "QuizResults",
        "UserTypes",
        "RiderProfiles",
        "StandardCommissionRate",
        "RaiderCompensationRole",
        "RaiderDeductionFee",
        "UserFeeStructure",
        "DynamicSurgePricing",
        "UserDynamicSurge",
        "Articles",
        "AboutUs",
        "FAQ",
        "Policy",
        "Content",
        "Notification",
        "Coins",
        "Incentives",
        "Advertisements",
        "fileUpload",
        "DriverOrderCompetition",
        "CustomerOrderConfirmation",
        "Users",
        "RoleBasedAccessControl",
        "Transactions",
        "ServiceZones",
        "Wallets",
        "Orders",
        "Transactions",
        "Stripe",
        "Kpi",
        "Coin",
        "Incentive",
        "DriverPerformance",
        "BulkOrdersTab",
        "ReportAndAnalytics",
        "Kpi",
        "Coin",
        "Incentive",
        "DriverPerformance",
        "Disputes",
        "BulkOrders",
        "AdditionalServices",
        "ServiceEmailNumber",
        "DashboardPopup",
        "PromoCodes",
        "Conversations",
        "Messages",
        "AdditionalServicesLogs",
        "SurgePricingRules",
        "DisputeTypes",
        "DriverTiers",
      ],
    }),
  }),
});

export const {
  useGetAdditionalServicesQuery,
  useGetAdditionalServiceByIdQuery,
  useAddAdditionalServiceMutation,
  useUpdateAdditionalServiceMutation,
  useDeleteAdditionalServiceMutation,
  useGetServiceEmailNumberQuery,
  useUpdateServiceEmailNumberMutation,
  useDeleteServiceEmailNumberMutation,
  useGetAdditionalServicesLogsQuery,
} = additionalServicesApi;
