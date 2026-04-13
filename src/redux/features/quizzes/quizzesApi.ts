import { baseApi } from "@/redux/api/baseApi";

const quizzesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuizzes: builder.query({
      query: () => ({
        url: "/quizzes",
        method: "GET",
      }),
      providesTags: ["Quizzes"],
    }),

    getQuizById: builder.query({
      query: (id: number) => ({
        url: `/quizzes/${id}`,
        method: "GET",
      }),
      providesTags: ["Quizzes"],
    }),

    createQuiz: builder.mutation({
      query: (quizData) => ({
        url: "/quizzes",
        method: "POST",
        body: quizData,
      }),
      invalidatesTags: ["Quizzes"],
    }),

    updateQuiz: builder.mutation({
      query: ({ id, ...quizData }) => ({
        url: `/quizzes/${id}`,
        method: "PUT",
        body: quizData,
      }),
      invalidatesTags: ["Quizzes"]
    }),

    deleteQuiz: builder.mutation({
      query: (id: number) => ({
        url: `/quizzes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Quizzes"],
    }),

    getAllQuizsLogs: builder.query({
      query: (params) => ({
        url: "/quizzes/logs",
        method: "GET",
        params
      }),
      providesTags: ["Quizzes"],
    })
  }),
});

export const {
  useGetQuizzesQuery,
  useGetQuizByIdQuery,
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
  useGetAllQuizsLogsQuery
} = quizzesApi;