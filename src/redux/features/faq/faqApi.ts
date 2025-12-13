import { baseApi } from "@/redux/api/baseApi";

const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFAQ: builder.query({
      query: () => ({
        url: "/faq",
        method: "GET",
      }),
      providesTags: ["FAQ"],
    }),

    addFAQ: builder.mutation({
      query: (data) => ({
        url: "/faq",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FAQ"],
    }),

    updateFAQ: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/faq/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["FAQ"],
    }),

    updateFAQStatus: builder.mutation({
      query: (id) => ({
        url: `/faq/change-status/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["FAQ"],
    }),

    deleteFAQ: builder.mutation({
      query: (id) => ({
        url: `/faq/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FAQ"],
    }),
  }),
});

export const {
  useGetFAQQuery,
  useAddFAQMutation,
  useUpdateFAQMutation,
  useUpdateFAQStatusMutation,
  useDeleteFAQMutation,
} = faqApi;