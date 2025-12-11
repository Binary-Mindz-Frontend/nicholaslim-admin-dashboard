import { baseApi } from "@/redux/api/baseApi";

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("images", file); // MUST be "images"

        return {
          url: "/auth/upload",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Advertisements"],
    }),
  }),
});

export const { useUploadFileMutation } = uploadApi;
