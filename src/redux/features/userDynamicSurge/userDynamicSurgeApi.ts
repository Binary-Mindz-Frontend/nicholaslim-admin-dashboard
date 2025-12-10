import { baseApi } from "@/redux/api/baseApi";

const userDynamicSurgeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserDynamicSurge: build.query({
      query: () => ({
        url: "/user-dynamic-surge",
        method: "GET",
      }),
      providesTags: ["UserDynamicSurge"],
    }),

    singleUserDynamicSurge: build.query({
      query: (id) => ({
        url: `/user-dynamic-surge/${id}`,
        method: "GET",
      }),
      providesTags: ["UserDynamicSurge"],
    }),

    addUserDynamicSurge: build.mutation({
      query: (data) => ({
        url: "/user-dynamic-surge",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserDynamicSurge"],
    }),

    updateUserDynamicSurge: build.mutation({
      query: ({ id, ...data }) => ({
        url: `/user-dynamic-surge/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["UserDynamicSurge"],
    }),

    deleteUserDynamicSurge: build.mutation({
      query: (id) => ({
        url: `/user-dynamic-surge/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserDynamicSurge"],
    }),
  }),
});

export const {
  useGetUserDynamicSurgeQuery,
  useSingleUserDynamicSurgeQuery,
  useAddUserDynamicSurgeMutation,
  useUpdateUserDynamicSurgeMutation,
  useDeleteUserDynamicSurgeMutation,
} = userDynamicSurgeApi;
