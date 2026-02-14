import { useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { Message, MessageType } from "@/types/chat";
import { useAppDispatch } from "@/redux/hook";
import { addEvent, addMessage, setConnected } from "@/redux/chatSlice";

interface SendMessageParams {
  receiverId: string;
  content: string;
  messageType: MessageType;
}

const CURRENT_USER_ID = "1";

export const useChatSocket = (url: string) => {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useAppDispatch();

  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      console.log("Socket already connected");
      return;
    }

    try {
      const socketUrl = url.replace(/^http/, "ws");

      socketRef.current = io(socketUrl, {
        transports: ["websocket", "polling"],
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current.on("connect", () => {
        console.log("Socket connected successfully");
        dispatch(setConnected(true));
        dispatch(addEvent("✅ Connected to chat server"));
      });

      // Listen for message acknowledgements
      socketRef.current.on("receive_message", (data: any) => {
        console.log("Received message:", data);

        const incomingMsg: Message = {
          id: data.id || `msg-${Date.now()}`,
          receiverId: data.receiverId?.toString() || "",
          senderId: data.senderId?.toString() || "",
          content: data.content,
          messageType: data.messageType || "TEXT",
          timestamp: data.timestamp || new Date().toISOString(),
          status: "delivered",
        };

        dispatch(
          addMessage({
            receiverId: incomingMsg.senderId,
            message: incomingMsg,
          }),
        );

        dispatch(addEvent(`📩 New message from User ${incomingMsg.senderId}`));
      });

      socketRef.current.on("new_notification", (data: any) => {
        console.log("Notification:", data);
        dispatch(addEvent(`🔔 ${data.message || "New notification"}`));
      });

      socketRef.current.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        dispatch(setConnected(false));
        dispatch(addEvent(`🔌 Disconnected: ${reason}`));
      });

      socketRef.current.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
        dispatch(addEvent(`❌ Connection error: ${err.message}`));
      });
    } catch (error) {
      console.error("Failed to create socket connection:", error);
      dispatch(addEvent(`❌ Failed to connect: ${error}`));
    }
  }, [dispatch, url]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      dispatch(setConnected(false));
      dispatch(addEvent("👋 Disconnected manually"));
    }
  }, [dispatch]);

  const sendMessage = useCallback(
    (params: SendMessageParams) => {
      if (!socketRef.current?.connected) {
        dispatch(addEvent("❌ Cannot send: Not connected"));
        return false;
      }

      try {
        const payload = {
          receiverId: params.receiverId,
          content: params.content,
          messageType: params.messageType,
        };

        console.log("Sending message with ack:", payload);

        // Use acknowledgement pattern
        socketRef.current.emit("send_message", payload, (response: any) => {
          console.log("Message acknowledgement:", response);

          if (response && response.success) {
            dispatch(addEvent(`✅ Message delivered to server`));

            // Replace optimistic message with real one if ID is returned
            if (response.messageId) {
              // You can update the message status here
              dispatch(addEvent(`📋 Message ID: ${response.messageId}`));
            }
          } else {
            dispatch(addEvent(`❌ Server rejected message`));
          }
        });

        // Optimistic UI update
        const localMsg: Message = {
          id: `temp-${Date.now()}`,
          receiverId: params.receiverId,
          senderId: CURRENT_USER_ID,
          content: params.content,
          messageType: params.messageType,
          timestamp: new Date().toISOString(),
          status: "sending",
        };

        dispatch(
          addMessage({
            receiverId: params.receiverId,
            message: localMsg,
          }),
        );

        dispatch(addEvent(`📤 Message sent to User ${params.receiverId}`));

        return true;
      } catch (error) {
        console.error("Failed to send message:", error);
        dispatch(addEvent(`❌ Send failed: ${error}`));
        return false;
      }
    },
    [dispatch],
  );

  return {
    connect,
    disconnect,
    sendMessage,
    socket: socketRef.current,
  };
};