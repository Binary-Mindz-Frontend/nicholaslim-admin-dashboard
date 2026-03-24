import { baseApi } from "@/redux/api/baseApi";

const policyManagementApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPolicies: build.query({
      query: () => ({
        url: "/policy",
        method: "GET",
      }),
      providesTags: ["Policy", "AdditionalServicesLogs"],
    }),

    getPolicyById: build.query({
      query: (id) => ({
        url: `/policy/${id}`,
        method: "GET",
      }),
      providesTags: ["Policy", "AdditionalServicesLogs"],
    }),

    addPolicy: build.mutation({
      query: (data) => ({
        url: "/policy",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Policy", "AdditionalServicesLogs"],
    }),

    updatePolicy: build.mutation({
      query: ({ id, ...data }) => ({
        url: `/policy/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Policy", "AdditionalServicesLogs"],
    }),

    updatePolicyStatus: build.mutation({
      query: (id) => ({
        url: `/policy/${id}/publish`,
        method: "PATCH",
      }),
      invalidatesTags: ["Policy", "AdditionalServicesLogs"],
    }),

    deletePolicy: build.mutation({
      query: (id) => ({
        url: `/policy/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Policy", "AdditionalServicesLogs"],
    }),
  }),
});

export const {
  useGetPoliciesQuery,
  useGetPolicyByIdQuery,
  useAddPolicyMutation,
  useUpdatePolicyMutation,
  useUpdatePolicyStatusMutation,
  useDeletePolicyMutation,
} = policyManagementApi;
