import { baseApi } from "@/redux/api/baseApi";

const driversApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Image upload mutation
        uploadImage: builder.mutation({
            query: (formData) => ({
                url: "/auth/upload",
                method: "POST",
                body: formData,
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
                    url,
                    method: "GET",
                };
            },
            providesTags: ["RiderProfiles"],
        }),

        getApprovedRiderProfiles: builder.query({
            query: ({
                raiderId,
                raider_name,
                page = 1,
                limit = 10,
            }) => {

                let url = `/raider-profile/rider-profiles?page=${page}&limit=${limit}`;

                if (raider_name) {
                    url += `&raider_name=${encodeURIComponent(raider_name)}`;
                }
                if (raiderId) {
                    url += `&raiderId=${raiderId}`;
                }

                url += `&raider_verificationFromAdmin=APPROVED`;

                return {
                    url,
                    method: "GET",
                };
            },
            providesTags: ["RiderProfiles"],
        }),

        getGoinReqestRiderProfiles: builder.query({
            query: ({
                raiderId,
                raider_name,
                raiderVerificationFromAdmin,
                loginType,
                page = 1,
                limit = 10,
            }) => {
                const params = new URLSearchParams();

                // Add basic pagination
                params.append("page", page.toString());
                params.append("limit", limit.toString());

                // Add optional filters
                if (raiderId) params.append("raiderId", raiderId.toString());
                if (raider_name) params.append("raider_name", raider_name);
                if (raiderVerificationFromAdmin) params.append("raider_verificationFromAdmin", raiderVerificationFromAdmin);
                if (loginType) params.append("loginType", loginType);

                return {
                    url: `/raider-profile/rider-profiles?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["RiderProfiles"],
        }),


        // Get single rider profile by ID
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
            any,
            { raiderId: string | number; verify: "APPROVED" | "REJECTED" | "PENDING" }
        >({
            query: ({ raiderId, verify }) => ({

                url: `/raider-profile/verify-rider/${raiderId}/${verify}`,
                method: "PATCH",
            }),

            invalidatesTags: ({ raiderId }) => [
                { type: "RiderProfiles", id: "LIST" },
                { type: "RiderProfiles", id: raiderId },
            ],
        }),

        getRaiderAdminData: builder.query({
            query: (id) => ({
                url: `/my-raider/admin/${id}`,
                method: "GET",
            }),

            providesTags: (id) => [{ type: "RiderProfiles", id }],
        }),

        getUserOrderHistory: builder.query({
            query: ({ id, page = 1, limit = 10 }) => ({
                url: `/order/user-history/${id}?page=${page}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ({ id }) => [{ type: "RiderProfiles", id }],
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
    useGetGoinReqestRiderProfilesQuery,
    useGetRaiderAdminDataQuery,
    useGetUserOrderHistoryQuery,
    useGetApprovedRiderProfilesQuery,
} = driversApi;