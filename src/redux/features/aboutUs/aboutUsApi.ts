import { baseApi } from "@/redux/api/baseApi";

const aboutUsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAboutUs: build.query({
      query: () => ({
        url: "/aboutus",
        method: "GET",
      }),
      providesTags: ["AboutUs"],
    }),

    addAboutUs: build.mutation({
      query: (data) => ({
        url: "/aboutus",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AboutUs"],
    }),

    updateAboutUs: build.mutation({
      query: ({ id, ...data }) => ({
        url: `/aboutus/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AboutUs"],
    }),

    updateAboutUsStatus: build.mutation({
      query: (id) => ({
        url: `/aboutus/changeStatus/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["AboutUs"],
    }),

    deleteAboutUs: build.mutation({
      query: (id) => ({
        url: `/aboutus/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AboutUs"],
    }),
  }),
});

export const {
  useGetAboutUsQuery,
  useAddAboutUsMutation,
  useUpdateAboutUsMutation,
  useUpdateAboutUsStatusMutation,
  useDeleteAboutUsMutation,
} = aboutUsApi;