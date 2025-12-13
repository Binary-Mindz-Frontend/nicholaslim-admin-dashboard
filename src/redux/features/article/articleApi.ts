import { baseApi } from "@/redux/api/baseApi";

const articleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getArticles: builder.query({
      query: () => ({
        url: "/article",
        method: "GET",
      }),
      providesTags: ["Articles"],
    }),

    addArticle: builder.mutation({
      query: (data) => ({
        url: "/article",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Articles"],
    }),

    updateArticle: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/article/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Articles"],
    }),

    updateArticleStatus: builder.mutation({
      query: (id) => ({
        url: `/article/change-status/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Articles"],
    }),

    deleteArticle: builder.mutation({
      query: (id) => ({
        url: `/article/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Articles"],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useAddArticleMutation,
  useUpdateArticleMutation,
  useUpdateArticleStatusMutation,
  useDeleteArticleMutation,
} = articleApi;