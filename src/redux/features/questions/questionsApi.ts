import { baseApi } from "@/redux/api/baseApi";

const questionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new question (Admin Only)
    createQuestion: builder.mutation({
      query: (data) => ({
        url: "/questions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Questions"],
    }),

    // Get all questions by quizId
    getAllQuestionsByQuizId: builder.query({
      query: (quizId) => ({
        url: `/questions/${quizId}`,
        method: "GET",
      }),
      providesTags: ["Questions"],
    }),

    // Get a single question by ID
    getQuestionById: builder.query({
      query: (id) => ({
        url: `/questions/${id}`,
        method: "GET",
      }),
      providesTags: (id) => [{ type: "Questions", id }],
    }),

    // Update a question (admin only)
    updateQuestion: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/questions/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Questions"],
    }),

    // Delete a question by ID (admin only)
    deleteQuestion: builder.mutation({
      query: (id) => ({
        url: `/questions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Questions"],
    }),

    // Get all quiz results (Admin only)
    getAllQuizResults: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
        
        const queryString = queryParams.toString();
        return {
          url: `/questions/quiz/ans/all${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["QuizResults"],
    }),

    // Get quiz results details for specific raider (admin only)
    getQuizResultsByRaiderId: builder.query({
      query: (raiderId) => ({
        url: `/questions/quiz/ans/${raiderId}`,
        method: "GET",
      }),
      providesTags: ["QuizResults"],
    }),

    // Delete quiz results details for the logged-in raider (admin only)
    deleteQuizResult: builder.mutation({
      query: (id) => ({
        url: `/questions/quiz/ans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["QuizResults"],
    }),
  }),
});

export const {
  useCreateQuestionMutation,
  useGetAllQuestionsByQuizIdQuery,
  useGetQuestionByIdQuery,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useGetAllQuizResultsQuery,
  useGetQuizResultsByRaiderIdQuery,
  useDeleteQuizResultMutation,
} = questionsApi;