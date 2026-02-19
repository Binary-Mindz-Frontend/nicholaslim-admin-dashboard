export type MessageType = "TEXT" | "IMAGE" | "PDF";

export interface Message {
  id: string;
  receiverId: string;
  senderId: string;
  content: string;
  messageType: MessageType;
  timestamp: string;
  status?: "sending" | "sent" | "delivered" | "read";
  fileUrl?: string | null;
  isRead?: boolean;
}

export interface Conversation {
  id: string;
  otherUserId: string;
  otherUserEmail: string;
  lastMessage?: {
    id: string;
    content: string;
    messageType: string;
    createdAt: string;
  };
  unreadCount: number;
  updatedAt: string;
}

export interface WebSocketEvent {
  type: "new_notification" | "receive_message";
  data: any;
}