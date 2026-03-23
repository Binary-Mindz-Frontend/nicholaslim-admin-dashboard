import { baseApi } from "@/redux/api/baseApi";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface OtherUser {
  id: number;
  email: string;
}

export interface LastMessage {
  id: string;
  content: string;
  messageType: string;
  fileUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  otherUser: OtherUser;
  lastMessage: LastMessage | null;
  unreadCount: number;
  updatedAt: string;
  createdAt: string;
}

export interface MessageResponse {
  id: string;
  content: string;
  messageType: string;
  fileUrl: string | null;
  isRead: boolean;
  createdAt: string;
  senderId?: number;
  receiverId?: number;
  conversationId?: string;
  sender?: { id: number; email: string };
  receiver?: { id: number; email: string };
}

export interface MessagesData {
  messages: MessageResponse[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  conversationId: string;
}

export interface CreateConversationRequest {
  otherUserId: string;
}

export interface CreateConversationResponse {
  id: string;
}

export interface GetMessagesRequest {
  otherUserId: string;
  beforeMessageId?: string;
}

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createConversation: builder.mutation<
      ApiResponse<CreateConversationResponse>,
      CreateConversationRequest
    >({
      query: (body) => ({
        url: "/chat/conversations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Conversations", "Messages"],
    }),

    getConversations: builder.query<ApiResponse<Conversation[]>, void>({
      query: () => ({
        url: "/chat/conversations",
        method: "GET",
      }),
      providesTags: ["Conversations", "Messages"],
    }),

    getMessages: builder.query<
      ApiResponse<MessagesData>,
      GetMessagesRequest
    >({
      query: ({ otherUserId, beforeMessageId }) => ({
        url: "/chat/messages",
        method: "POST",
        body: { otherUserId, beforeMessageId },
      }),
      providesTags: ["Messages", "Conversations"],
    }),

    updateReadMessage: builder.mutation<
      ApiResponse<void>,
      { conversationId: string }
    >({
      query: ({ conversationId }) => ({
        url: `/chat/read/${conversationId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Conversations", "Messages"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateConversationMutation,
  useGetConversationsQuery,
  useGetMessagesQuery,
  useUpdateReadMessageMutation,
} = chatApi;
