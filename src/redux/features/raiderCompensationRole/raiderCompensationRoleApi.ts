import { baseApi } from "@/redux/api/baseApi";

const raiderCompensationRoleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRaiderCompensationRole: builder.query({
      query: () => ({
        url: "/raider-compensation-role",
        method: "GET",
      }),
      providesTags: ["RaiderCompensationRole"],
    }),

    singleRaiderCompensationRole: builder.query({
      query: (id) => ({
        url: `/raider-compensation-role/${id}`,
        method: "GET",
      }),
      providesTags: ["RaiderCompensationRole"],
    }),

    addRaiderCompensationRole: builder.mutation({
      query: (data) => ({
        url: "/raider-compensation-role",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["RaiderCompensationRole"],
    }),

    updateRaiderCompensationRole: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/raider-compensation-role/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["RaiderCompensationRole"],
    }),

    deleteRaiderCompensationRole: builder.mutation({
      query: (id) => ({
        url: `/raider-compensation-role/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RaiderCompensationRole"],
    }),
  }),
});

export const {
  useGetRaiderCompensationRoleQuery,
  useSingleRaiderCompensationRoleQuery,
  useAddRaiderCompensationRoleMutation,
  useUpdateRaiderCompensationRoleMutation,
  useDeleteRaiderCompensationRoleMutation,
} = raiderCompensationRoleApi;
