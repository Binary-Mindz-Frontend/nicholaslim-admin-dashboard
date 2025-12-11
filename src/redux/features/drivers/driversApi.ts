import { baseApi } from "@/redux/api/baseApi";

const driversApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Image upload mutation
        uploadImage: builder.mutation({
  query: (formData) => ({
    url: "/auth/upload", // Your backend endpoint
    method: "POST",
    body: formData, // Send FormData object containing multiple files
    // No need to set Content-Type header, the browser will do it automatically
  }),
}),

        getRiderProfiles: builder.mutation({
            query: ({
                raiderVerificationFromAdmin,
                raiderId,
                raider_name,
                page = 1,
                limit = 10,
                sortBy = "created_at",
                sortOrder = "desc"
            }) => {
                return {
                    url: `/raider-profile/rider-profiles`,
                    method: "POST",
                    body: {
                        raider_verificationFromAdmin: raiderVerificationFromAdmin,
                        raiderId: raiderId,
                        raider_name: raider_name,
                        page: page,
                        limit: limit,
                        sortBy: sortBy,
                        sortOrder: sortOrder,
                    },
                };
            },
            invalidatesTags: ["RiderProfiles"],
        }),

        // NEW: Get single rider profile by ID
        getRiderProfileById: builder.query({
            query: (id) => ({
                url: `/raider-profile/${id}`,
                method: "GET",
            }),
            providesTags: ( id) => [{ type: "RiderProfiles", id }],
        }),

        toggleRiderActiveStatus: builder.mutation({
            query: (id) => ({
                url: `/raider-profile/active/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["RiderProfiles"],
        }),

        deleteRiderProfile: builder.mutation({
            query: (id) => {
                const request = {
                    url: `/raider-profile/${id}`,
                    method: "DELETE",
                };
                return request;
            },
            invalidatesTags: ["RiderProfiles"],
        }),

        addRiderProfile: builder.mutation({
            query: (data) => ({
                url: `/raider-profile/admin/create-rider`,
                method: "POST",
                body: data,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            invalidatesTags: ["RiderProfiles"],
        }),

        updateRiderProfile: builder.mutation({
            query: ({ id, data }) => ({
                url: `/raider-profile/admin/update-rider/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["RiderProfiles"],
        }),
    }),
});

export const {
    useUploadImageMutation,
    useGetRiderProfileByIdQuery,
    useGetRiderProfilesMutation,
    useToggleRiderActiveStatusMutation,
    useDeleteRiderProfileMutation,
    useAddRiderProfileMutation,
    useUpdateRiderProfileMutation,
} = driversApi;