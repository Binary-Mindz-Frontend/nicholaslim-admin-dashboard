/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message, Conversation } from "@/types/chat";

interface ChatState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  activeConversation: string | null;
  isConnected: boolean;
  events: string[];
  unreadCounts: Record<string, number>;
  lastMessageArrivalTime: Record<string, string>;
}

const initialState: ChatState = {
  conversations: [],
  messages: {},
  activeConversation: null,
  isConnected: false,
  events: [],
  unreadCounts: {},
  lastMessageArrivalTime: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    addEvent: (state, action: PayloadAction<string>) => {
      state.events.push(action.payload);
      if (state.events.length > 50) {
        state.events = state.events.slice(-50);
      }
    },
    clearEvents: (state) => {
      state.events = [];
    },
    setActiveConversation: (state, action: PayloadAction<string>) => {
      state.activeConversation = action.payload;
    },
    resetUnreadCount: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      state.unreadCounts[userId] = 0;
      delete state.lastMessageArrivalTime[userId];
    },
    addMessage: (
      state,
      action: PayloadAction<{ receiverId: string; message: Message }>,
    ) => {
      const { receiverId, message } = action.payload;
      if (!state.messages[receiverId]) {
        state.messages[receiverId] = [];
      }

      const existingIndex = state.messages[receiverId].findIndex(
        (m) =>
          m.id === message.id ||
          (m.id.startsWith("temp-") &&
            m.content === message.content &&
            m.timestamp === message.timestamp),
      );

      if (existingIndex === -1) {
        state.messages[receiverId].push(message);

        // If it's an incoming message and not for the active conversation, increment unread count
        const currentUserId = localStorage.getItem("userId") || "1";
        const isIncoming = message.senderId !== currentUserId;
        const isNotActive = receiverId !== state.activeConversation;

        if (isIncoming && isNotActive) {
          state.unreadCounts[receiverId] = (state.unreadCounts[receiverId] || 0) + 1;
          if (!state.lastMessageArrivalTime[receiverId]) {
            state.lastMessageArrivalTime[receiverId] = message.timestamp;
          }
        }
      } else {
        state.messages[receiverId][existingIndex] = message;
      }

      state.messages[receiverId].sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );
    },
    updateMessageStatus: (
      state,
      action: PayloadAction<{ messageId: string; status: string }>,
    ) => {
      const { messageId, status } = action.payload;
      Object.keys(state.messages).forEach((key) => {
        const msg = state.messages[key]?.find((m) => m.id === messageId);
        if (msg) msg.status = status as any;
      });
    },
  },
});

export const {
  setConnected,
  addEvent,
  clearEvents,
  addMessage,
  setActiveConversation,
  updateMessageStatus,
  resetUnreadCount,
} = chatSlice.actions;

export default chatSlice.reducer;
