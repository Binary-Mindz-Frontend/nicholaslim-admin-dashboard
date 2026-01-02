import { baseApi } from "@/redux/api/baseApi";

const userFeeStructureApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserFeeStructure: builder.query({
      query: () => ({
        url: "/user-fee-structure",
        method: "GET",
      }),
      providesTags: ["UserFeeStructure"],
    }),

    singleUserFeeStructure: builder.query({
      query: (id) => ({
        url: `/user-fee-structure/${id}`,
        method: "GET",
      }),
      providesTags: ["UserFeeStructure"],
    }),

    addUserFeeStructure: builder.mutation({
      query: (data) => ({
        url: "/user-fee-structure",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserFeeStructure"],
    }),

    updateUserFeeStructure: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/user-fee-structure/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["UserFeeStructure"],
    }),

    deleteUserFeeStructure: builder.mutation({
      query: (id) => ({
        url: `/user-fee-structure/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserFeeStructure"],
    }),
  }),
});

export const {
  useGetUserFeeStructureQuery,
  useSingleUserFeeStructureQuery,
  useAddUserFeeStructureMutation,
  useUpdateUserFeeStructureMutation,
  useDeleteUserFeeStructureMutation,
} = userFeeStructureApi;
