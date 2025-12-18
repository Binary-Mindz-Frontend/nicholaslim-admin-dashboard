import { baseApi } from "@/redux/api/baseApi";

const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addCustomRoleUser: builder.mutation({
      query: (data) => ({
        url: "/users/admin/custom-role-user",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useAddCustomRoleUserMutation } = usersApi;
