import { baseApi } from "@/redux/api/baseApi";

const disputetypesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDisputeTypes: builder.query({
      query: () => ({
        url: "/admin/dispute-types",
        method: "GET",
      }),
      providesTags: ["DisputeTypes"],
    }),

    createDisputeType: builder.mutation({
      query: (data) => ({
        url: "/admin/dispute-types",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["DisputeTypes"],
    }),

    updateDisputeType: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/dispute-types/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["DisputeTypes"],
    }),

    deleteDisputeType: builder.mutation({
      query: (id) => ({
        url: `/admin/dispute-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DisputeTypes"],
    }),
  }),
});

export const {
  useGetDisputeTypesQuery,
  useCreateDisputeTypeMutation,
  useUpdateDisputeTypeMutation,
  useDeleteDisputeTypeMutation,
} = disputetypesApi;