/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

// --- Interfaces ---
interface StripeCredentials {
    publicKey: string;
    secretKey: string;
}

interface StripeCredentialsResponse {
    success: boolean;
    message: string;
    data: StripeCredentials;
}

interface SetupIntentResponse {
    success: boolean;
    message: string;
    data: {
        clientSecret: string;
    };
}

// interface SaveCardRequest {
//     paymentMethodId: string;
// }

interface AddMoneyRequest {
    amount: number;
    paymentMethodId: string;
}

interface AddMoneyResponse {
    success: boolean;
    message: string;
    data?: any;
}

interface AddStripeFundsRequest {
    amount: number;
}

interface AddStripeFundsResponse {
    success: boolean;
    message: string;
    data?: any;
}
// New interface for the Card data
export interface WalletCard {
    id: number;
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
    isDefault: boolean;
    stripeMethodId: string;

}

// --- API Definition ---
const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // 1. Get Setup Intent Client Secret
        createSetupIntent: builder.mutation<SetupIntentResponse, void>({
            query: () => ({
                url: "/wallet/create-setup-intent",
                method: "POST",
            }),
        }),

        // 2. Save the Payment Method ID to Backend
        saveCard: builder.mutation<any, { paymentMethodId: string }>({
            query: (payload) => ({
                url: "/wallet/save-card",
                method: "POST",
                body: payload, // This will send { paymentMethodId: "pm_..." }
            }),
            invalidatesTags: ["Stripe"],
        }),
        // Get Stripe credentials
        getStripeCredentials: builder.query<StripeCredentialsResponse, void>({
            query: () => ({
                url: "/stripe/credentials",
                method: "GET",
            }),
            providesTags: ["Stripe"],
        }),

        // Add money to wallet
        addMoneyToWallet: builder.mutation<AddMoneyResponse, AddMoneyRequest>({
            query: (data) => ({
                url: "/wallet/add-money",
                method: "POST",
                body: {
                    amount: data.amount,
                    paymentMethodId: data.paymentMethodId,
                },
            }),
            invalidatesTags: ["Stripe"],
        }),

        addMoneyToStripe: builder.mutation<AddStripeFundsResponse, AddStripeFundsRequest>({
            query: (data) => ({
                url: "/stripe/add-funds",
                method: "POST",
                body: {
                    amount: data.amount,
                },
            }),
            invalidatesTags: ["Stripe"],
        }),

        getWalletBalance: builder.query<any, void>({
            query: () => ({
                url: "/wallet/balance",
                method: "GET",
            }),
            providesTags: ["Stripe"],
        }),

        getTransactionHistory: builder.query<any, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 20 }) => {
                const url = `/wallet/transactions?page=${page}&limit=${limit}`;
                return {
                    url,
                    method: "GET",
                };
            },
            providesTags: ["Stripe"],
        }),

        getWalletCards: builder.query<WalletCard[], void>({
            query: () => ({
                url: "/wallet/wallet/cards",
                method: "GET",
            }),
            // This ensures that when saveCard is called, this list refreshes
            providesTags: ["Stripe"], 
        }),

        // 3. Delete a saved card by ID
deleteCard: builder.mutation<{ success: boolean; message: string }, number>({
  query: (cardId) => ({
    url: `/wallet/wallet/cards/${cardId}`,
    method: "DELETE",
  }),
  invalidatesTags: ["Stripe"], // This will refresh wallet cards list
}),


    }),
});

export const {
    useCreateSetupIntentMutation,
    useSaveCardMutation,
    useGetStripeCredentialsQuery,
    useAddMoneyToWalletMutation,
    useAddMoneyToStripeMutation,
    useGetWalletBalanceQuery,
    useGetTransactionHistoryQuery,
    useGetWalletCardsQuery,
    useDeleteCardMutation,
} = paymentApi;