import { baseApi } from "@/redux/api/baseApi";

const driversApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
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

        // Mutation to toggle rider status (e.g., active/inactive)
        toggleRiderActiveStatus: builder.mutation({
            query: (id) => ({
                url: `/raider-profile/active/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["RiderProfiles"],
        }),

        // Mutation to delete rider profile
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
                body: data, // Send as JSON
                headers: {
                    'Content-Type': 'application/json', // Explicitly set JSON header
                },
            }),
            invalidatesTags: ["RiderProfiles"],
        }),
        // Mutation to update rider profile
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
    useGetRiderProfilesMutation,
    useToggleRiderActiveStatusMutation,
    useDeleteRiderProfileMutation,
    useAddRiderProfileMutation,
    useUpdateRiderProfileMutation,
} = driversApi;