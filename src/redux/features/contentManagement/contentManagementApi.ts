import { baseApi } from "@/redux/api/baseApi";

const contentManagementApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getContent: build.query({
      query: () => ({
        url: "/content-management",
        method: "GET",
      }),
      providesTags: ["Content", "AdditionalServicesLogs"],
    }),

    getContentById: build.query({
      query: (id) => ({
        url: `/content-management/${id}`,
        method: "GET",
      }),
      providesTags: ["Content", "AdditionalServicesLogs"],
    }),

    addContent: build.mutation({
      query: (data) => ({
        url: "/content-management",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Content", "AdditionalServicesLogs"],
    }),

    updateContent: build.mutation({
      query: ({ id, ...data }) => ({
        url: `/content-management/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Content", "AdditionalServicesLogs"],
    }),

    deleteContent: build.mutation({
      query: (id) => ({
        url: `/content-management/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Content", "AdditionalServicesLogs" ],
    }),

    getAllContentLogs: build.query({
      query: (params) => ({
        url: "/content-management/logs",
        method: "GET",
        params
      }),
      providesTags: ["Content", "AdditionalServicesLogs"],
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
