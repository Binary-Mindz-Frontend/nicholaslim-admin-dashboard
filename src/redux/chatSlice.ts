/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message, Conversation } from "@/types/chat";

interface ChatState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  activeConversation: string | null;
  isConnected: boolean;
  events: string[];
}

const initialState: ChatState = {
  conversations: [],
  messages: {},
  activeConversation: null,
  isConnected: false,
  events: [],
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
} = chatSlice.actions;

export default chatSlice.reducer;
