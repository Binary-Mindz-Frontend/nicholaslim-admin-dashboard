import { baseApi } from "@/redux/api/baseApi";

const contentManagementApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getContent: build.query({
            query: () => ({
                url: "/content-management",
                method: "GET",
            }),
        }),

        getContentById: build.query({
            query: (id) => ({
                url: `/content-management/${id}`,
                method: "GET",
            }),
        }),

        addContent: build.mutation({
            query: (data) => ({
                url: "/content-management",
                method: "POST",
                body: data,
            }),
        }),

        updateContent: build.mutation({
            query: ({ id, ...data }) => ({
                url: `/content-management/${id}`,
                method: "PATCH",
                body: data,
            }),
        }),

        deleteContent: build.mutation({
            query: (id) => ({
                url: `/content-management/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetContentQuery,
    useGetContentByIdQuery,
    useAddContentMutation,
    useUpdateContentMutation,
    useDeleteContentMutation,
} = contentManagementApi;
