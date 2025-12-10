import { baseApi } from "@/redux/api/baseApi";

const policyManagementApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPolicies: build.query({
      query: () => ({
        url: "/policy",
        method: "GET",
      }),
      providesTags: ["Policy"],
    }),

    getPolicyById: build.query({
      query: (id) => ({
        url: `/policy/${id}`,
        method: "GET",
      }),
      providesTags: ["Policy"],
    }),

    addPolicy: build.mutation({
      query: (data) => ({
        url: "/policy",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Policy"],
    }),

    updatePolicy: build.mutation({
      query: ({ id, ...data }) => ({
        url: `/policy/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Policy"],
    }),

    updatePolicyStatus: build.mutation({
      query: (id) => ({
        url: `/policy/${id}/publish`,
        method: "PATCH",
      }),
      invalidatesTags: ["Policy"],
    }),

    deletePolicy: build.mutation({
      query: (id) => ({
        url: `/policy/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Policy"],
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
