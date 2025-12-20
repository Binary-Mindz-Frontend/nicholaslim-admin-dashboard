import { baseApi } from "@/redux/api/baseApi";

const driversApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Image upload mutation
        uploadImage: builder.mutation({
            query: (formData) => ({
                url: "/auth/upload", // Your backend endpoint
                method: "POST",
                body: formData, // Send FormData object containing multiple files
            }),
        }),

        getRiderProfiles: builder.query({
            query: ({
                raiderId,
                raider_name,
                raiderVerificationFromAdmin,
                page = 1,
                limit = 10,
            }) => {
                // Construct the URL with query parameters
                let url = `/raider-profile/rider-profiles?page=${page}&limit=${limit}`;

                // Add additional query parameters if they exist
                if (raider_name) {
                    url += `&raider_name=${encodeURIComponent(raider_name)}`;
                }
                if (raiderId) {
                    url += `&raiderId=${raiderId}`;
                }
                if (raiderVerificationFromAdmin) {
                    url += `&raider_verificationFromAdmin=${raiderVerificationFromAdmin}`;
                }

                return {
                    url,  // Use the constructed URL with query params
                    method: "GET",  // Use the GET method instead of POST
                };
            },
            providesTags: ["RiderProfiles"],  // Ensure you provide appropriate tags
        }),


        // NEW: Get single rider profile by ID
        getRiderProfileById: builder.query({
            query: (id) => ({
                url: `/raider-profile/${id}`,
                method: "GET",
            }),
            providesTags: (id) => [{ type: "RiderProfiles", id }],
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

        unsuspendRiderProfile: builder.mutation({
            query: (id) => ({
                url: `/raider-profile/unsuspend/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["RiderProfiles"],
        }),

        suspendRiderProfile: builder.mutation({
            query: ({ id, data }) => ({
                url: `/raider-profile/suspend/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["RiderProfiles"],
        }),

      verifyRiderProfile: builder.mutation<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any, // Replace 'any' with your expected response type if preferred
  { raiderId: string | number; verify: "APPROVED" | "REJECTED" | "PENDING" }
>({
  query: ({ raiderId, verify }) => ({
    // Matches: /raider-profile/verify-rider/4/APPROVED
    url: `/raider-profile/verify-rider/${raiderId}/${verify}`,
    method: "PATCH",
  }),
  // This tells Redux to refetch getRiderProfiles and getRiderProfileById
  invalidatesTags: (result, error, { raiderId }) => [
    { type: "RiderProfiles", id: "LIST" },
    { type: "RiderProfiles", id: raiderId },
  ],
}),

    }),
});

export const {
    useUploadImageMutation,
    useGetRiderProfileByIdQuery,
    useGetRiderProfilesQuery,
    useToggleRiderActiveStatusMutation,
    useDeleteRiderProfileMutation,
    useAddRiderProfileMutation,
    useUpdateRiderProfileMutation,
    useSuspendRiderProfileMutation,
    useUnsuspendRiderProfileMutation,
    useVerifyRiderProfileMutation,
} = driversApi;