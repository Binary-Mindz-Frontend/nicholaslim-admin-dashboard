import { baseApi } from "@/redux/api/baseApi";

const contentManagementApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getContent: build.query({
      query: () => ({
        url: "/content-management",
        method: "GET",
      }),
      providesTags: ["Content"],
    }),

    getContentById: build.query({
      query: (id) => ({
        url: `/content-management/${id}`,
        method: "GET",
      }),
      providesTags: ["Content"],
    }),

    addContent: build.mutation({
      query: (data) => ({
        url: "/content-management",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Content"],
    }),

    updateContent: build.mutation({
      query: ({ id, ...data }) => ({
        url: `/content-management/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Content"],
    }),

    deleteContent: build.mutation({
      query: (id) => ({
        url: `/content-management/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Content"],
    }),

    getAllContentLogs: build.query({
      query: () => ({
        url: "/content-management/logs",
        method: "GET",
      }),
      providesTags: ["Content"],
    })
  }),
});

export const {
  useGetContentQuery,
  useGetContentByIdQuery,
  useAddContentMutation,
  useUpdateContentMutation,
  useDeleteContentMutation,
  useGetAllContentLogsQuery
} = contentManagementApi;
