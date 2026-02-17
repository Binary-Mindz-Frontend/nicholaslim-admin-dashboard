/* eslint-disable @typescript-eslint/no-explicit-any */
// new code
import { useRef, useCallback, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { Message, MessageType } from "@/types/chat";
import { useAppDispatch } from "@/redux/hook";
import { addEvent, addMessage, setConnected } from "@/redux/chatSlice";

interface SendMessageParams {
  receiverId: string;
  content: string;
  messageType: MessageType;
  fileUrl?: string;
}

const CURRENT_USER_ID = "2"; // Make sure this matches your actual user ID

export const useChatSocket = (url: string) => {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useAppDispatch();
  const accessToken = localStorage.getItem("accessToken");

  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      console.log("Socket already connected");
      return;
    }

    if (!accessToken) {
      console.error("❌ No access token in localStorage!");
      dispatch(addEvent("❌ No access token found"));
      return;
    }

    try {
      // Extract base URL (remove /api/v1/messages if present)
      const baseUrl = url
        .replace(/\/+$/, "");
      console.log("🔌 Connecting to base URL:", baseUrl);

      socketRef.current = io(baseUrl, {
        transports: ["websocket", "polling"],
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        autoConnect: true,
        auth: {
          token: accessToken,
        },
        path: "/socket.io", // Default socket.io path
      });

      socketRef.current.on("connect", () => {
        console.log("✅ Socket connected!");
        console.log("📡 Socket ID:", socketRef.current?.id);
        dispatch(setConnected(true));
        dispatch(addEvent("✅ Socket connected to server"));
      });

      socketRef.current.on("authenticated", (data: any) => {
        console.log("✅ Authentication successful:", data);
        dispatch(addEvent(`✅ Authenticated as User ${data.userId}`));
      });

      // Listen for incoming messages
      socketRef.current.on("message", (data: any) => {
        console.log("📨 Received message:", data);

        const messageData = data.data || data;

        const incomingMsg: Message = {
          id: messageData.id || `msg-${Date.now()}`,
          receiverId: String(messageData.receiverId || ""),
          senderId: String(messageData.senderId || ""),
          content: messageData.content,
          messageType: messageData.messageType || "TEXT",
          timestamp:
            messageData.timestamp ||
            messageData.createdAt ||
            new Date().toISOString(),
          status: "delivered",
          fileUrl: messageData.fileUrl,
          isRead: messageData.isRead || false,
        };

        dispatch(
          addMessage({
            receiverId:
              incomingMsg.senderId === CURRENT_USER_ID
                ? incomingMsg.receiverId
                : incomingMsg.senderId,
            message: incomingMsg,
          }),
        );

        dispatch(addEvent(`📩 New message from User ${incomingMsg.senderId}`));
      });

      // Listen for message acknowledgments
      socketRef.current.on("message_sent", (data: any) => {
        console.log("✅ Message sent confirmation:", data);
        dispatch(addEvent("✅ Message delivered to server"));

        // Update temporary message with real ID if needed
        if (data.messageId && data.tempId) {
          // You can implement message update logic here
        }
      });

      socketRef.current.on("error", (error: any) => {
        console.error("❌ Socket error:", error);
        dispatch(
          addEvent(`❌ Error: ${error.message || JSON.stringify(error)}`),
        );
      });

      socketRef.current.on("disconnect", (reason) => {
        console.log("🔌 Socket disconnected:", reason);
        dispatch(setConnected(false));
        dispatch(addEvent(`🔌 Disconnected: ${reason}`));
      });

      socketRef.current.on("connect_error", (err) => {
        console.error("❌ Connection error:", err.message);
        dispatch(setConnected(false));
        dispatch(addEvent(`❌ Connection error: ${err.message}`));
      });
    } catch (error) {
      console.error("Failed to create socket connection:", error);
      dispatch(addEvent(`❌ Failed to connect: ${error}`));
    }
  }, [dispatch, url, accessToken]);

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
        console.log("Socket not connected, attempting to connect...");
        connect();

        // Return promise instead of using setTimeout
        return new Promise((resolve, reject) => {
          const checkConnection = setInterval(() => {
            if (socketRef.current?.connected) {
              clearInterval(checkConnection);
              // Retry sending
              const result = sendMessage(params);
              resolve(result);
            }
          }, 100);

          // Timeout after 5 seconds
          setTimeout(() => {
            clearInterval(checkConnection);
            dispatch(addEvent("❌ Cannot send: Connection timeout"));
            reject(new Error("Connection timeout"));
          }, 5000);
        });
      }

      try {
        const payload = {
          receiverId: String(params.receiverId),
          content: params.content,
          messageType: params.messageType,
          fileUrl: params.fileUrl,
          timestamp: new Date().toISOString(),
        };

        console.log("📤 Sending message payload:", payload);

        // Emit with acknowledgment
        socketRef.current.emit("send_message", payload, (response: any) => {
          console.log("Server acknowledgment:", response);

          if (response && response.success) {
            dispatch(addEvent("✅ Message delivered to server"));
          } else {
            dispatch(
              addEvent(
                `❌ Server rejected: ${response?.error || "Unknown error"}`,
              ),
            );
          }
        });

        // Create local message
        const localMsg: Message = {
          id: `temp-${Date.now()}`,
          receiverId: String(params.receiverId),
          senderId: CURRENT_USER_ID,
          content: params.content,
          messageType: params.messageType,
          timestamp: new Date().toISOString(),
          status: "sending",
          fileUrl: params.fileUrl,
        };

        dispatch(
          addMessage({
            receiverId: String(params.receiverId),
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
    [dispatch, connect],
  );

  // Auto-connect on hook mount
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    connect,
    disconnect,
    sendMessage,
    socket: socketRef.current,
    isConnected: socketRef.current?.connected || false,
  };
};
// old code

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useRef, useCallback } from "react";
// import { io, Socket } from "socket.io-client";
// import { Message, MessageType } from "@/types/chat";
// import { useAppDispatch } from "@/redux/hook";
// import { addEvent, addMessage, setConnected } from "@/redux/chatSlice";

// interface SendMessageParams {
//   receiverId: string;
//   content: string;
//   messageType: MessageType;
// }

// const CURRENT_USER_ID = "1";

// export const useChatSocket = (url: string) => {
//   const socketRef = useRef<Socket | null>(null);
//   const dispatch = useAppDispatch();

//   const connect = useCallback(() => {
//     if (socketRef.current?.connected) {
//       console.log("Socket already connected");
//       return;
//     }

//     try {
//       const socketUrl = url.replace(/^http/, "ws");

//       socketRef.current = io(socketUrl, {
//         transports: ["websocket", "polling"],
//         withCredentials: true,
//         reconnection: true,
//         reconnectionAttempts: 5,
//         reconnectionDelay: 1000,
//       });

//       socketRef.current.on("connect", () => {
//         console.log("Socket connected successfully");
//         dispatch(setConnected(true));
//         dispatch(addEvent("✅ Connected to chat server"));
//       });

//       // Listen for message acknowledgements
//       socketRef.current.on("receive_message", (data: any) => {
//         console.log("Received message:", data);

//         const incomingMsg: Message = {
//           id: data.id || `msg-${Date.now()}`,
//           receiverId: data.receiverId?.toString() || "",
//           senderId: data.senderId?.toString() || "",
//           content: data.content,
//           messageType: data.messageType || "TEXT",
//           timestamp: data.timestamp || new Date().toISOString(),
//           status: "delivered",
//         };

//         dispatch(
//           addMessage({
//             receiverId: incomingMsg.senderId,
//             message: incomingMsg,
//           }),
//         );

//         dispatch(addEvent(`📩 New message from User ${incomingMsg.senderId}`));
//       });

//       socketRef.current.on("new_notification", (data: any) => {
//         console.log("Notification:", data);
//         dispatch(addEvent(`🔔 ${data.message || "New notification"}`));
//       });

//       socketRef.current.on("disconnect", (reason) => {
//         console.log("Socket disconnected:", reason);
//         dispatch(setConnected(false));
//         dispatch(addEvent(`🔌 Disconnected: ${reason}`));
//       });

//       socketRef.current.on("connect_error", (err) => {
//         console.error("Socket connection error:", err);
//         dispatch(addEvent(`❌ Connection error: ${err.message}`));
//       });
//     } catch (error) {
//       console.error("Failed to create socket connection:", error);
//       dispatch(addEvent(`❌ Failed to connect: ${error}`));
//     }
//   }, [dispatch, url]);

//   const disconnect = useCallback(() => {
//     if (socketRef.current) {
//       socketRef.current.disconnect();
//       socketRef.current = null;
//       dispatch(setConnected(false));
//       dispatch(addEvent("👋 Disconnected manually"));
//     }
//   }, [dispatch]);

//   const sendMessage = useCallback(
//     (params: SendMessageParams) => {
//       if (!socketRef.current?.connected) {
//         dispatch(addEvent("❌ Cannot send: Not connected"));
//         return false;
//       }

//       try {
//         const payload = {
//           receiverId: params.receiverId,
//           content: params.content,
//           messageType: params.messageType,
//         };

//         console.log("Sending message with ack:", payload);

//         // Use acknowledgement pattern
//         socketRef.current.emit("send_message", payload, (response: any) => {
//           console.log("Message acknowledgement:", response);

//           if (response && response.success) {
//             dispatch(addEvent(`✅ Message delivered to server`));

//             // Replace optimistic message with real one if ID is returned
//             if (response.messageId) {
//               // You can update the message status here
//               dispatch(addEvent(`📋 Message ID: ${response.messageId}`));
//             }
//           } else {
//             dispatch(addEvent(`❌ Server rejected message`));
//           }
//         });

//         // Optimistic UI update
//         const localMsg: Message = {
//           id: `temp-${Date.now()}`,
//           receiverId: params.receiverId,
//           senderId: CURRENT_USER_ID,
//           content: params.content,
//           messageType: params.messageType,
//           timestamp: new Date().toISOString(),
//           status: "sending",
//         };

//         dispatch(
//           addMessage({
//             receiverId: params.receiverId,
//             message: localMsg,
//           }),
//         );

//         dispatch(addEvent(`📤 Message sent to User ${params.receiverId}`));

//         return true;
//       } catch (error) {
//         console.error("Failed to send message:", error);
//         dispatch(addEvent(`❌ Send failed: ${error}`));
//         return false;
//       }
//     },
//     [dispatch],
//   );

//   return {
//     connect,
//     disconnect,
//     sendMessage,
//     socket: socketRef.current,
//   };
// };

// import { useRef, useCallback } from "react";
// import { io, Socket } from "socket.io-client";
// import { Message, MessageType } from "@/types/chat";
// import { useAppDispatch } from "@/redux/hook";
// import { addEvent, addMessage, setConnected } from "@/redux/chatSlice";

// interface SendMessageParams {
//   receiverId: string;
//   content: string;
//   messageType: MessageType;
// }

// const CURRENT_USER_ID = "1";

// export const useChatSocket = (url: string) => {
//   const socketRef = useRef<Socket | null>(null);
//   const dispatch = useAppDispatch();
//   const accessToken = localStorage.getItem("accessToken");

//   const connect = useCallback(() => {
//     if (socketRef.current?.connected) {
//       console.log("Socket already connected");
//       return;
//     }

//     if (!accessToken) {
//       console.error("❌ ERROR: No access token in localStorage!");
//       console.log("Attempting to get token from localStorage:");
//       console.log("Keys:", Object.keys(localStorage));
//       dispatch(addEvent("❌ No access token found"));
//       return;
//     }

//     try {
//       const socketUrl = url.replace(/\/+$/, "");
//       console.log("🔌 Connecting to socket URL:", socketUrl);
//       console.log("🔑 Access Token Length:", accessToken.length);
//       console.log("🔑 Token First 50 chars:", accessToken.substring(0, 50));

//       socketRef.current = io(socketUrl, {
//         transports: ["websocket", "polling"],
//         withCredentials: true,
//         reconnection: true,
//         reconnectionAttempts: 10,
//         reconnectionDelay: 1000,
//         reconnectionDelayMax: 5000,
//         timeout: 20000,
//         autoConnect: true,
//         // ✅ Token সঠিকভাবে পাঠান
//         auth: {
//           token: accessToken,
//         },
//       });

//       socketRef.current.on("connect", () => {
//         console.log("✅ Socket connected!");
//         console.log("📡 Socket ID:", socketRef.current?.id);
//         dispatch(setConnected(true));
//         dispatch(addEvent("✅ Socket connected to server"));
//       });

//       socketRef.current.on("connected", (data: any) => {
//         console.log("✅ Server confirmed connection:", data);
//         dispatch(addEvent(`✅ Authenticated as User ${data.userId}`));
//       });

//       socketRef.current.on("receive_message", (data: any) => {
//         console.log("📨 Received message:", data);

//         const messageData = data.data || data;

//         const incomingMsg: Message = {
//           id: messageData.id || `msg-${Date.now()}`,
//           receiverId: String(messageData.receiverId || ""),
//           senderId: String(messageData.senderId || ""),
//           content: messageData.content,
//           messageType: messageData.messageType || "TEXT",
//           timestamp:
//             messageData.timestamp ||
//             messageData.createdAt ||
//             new Date().toISOString(),
//           status: "delivered",
//           fileUrl: messageData.fileUrl,
//           isRead: messageData.isRead || false,
//         };

//         dispatch(
//           addMessage({
//             receiverId:
//               incomingMsg.senderId === CURRENT_USER_ID
//                 ? incomingMsg.receiverId
//                 : incomingMsg.senderId,
//             message: incomingMsg,
//           }),
//         );

//         dispatch(addEvent(`📩 New message from User ${incomingMsg.senderId}`));
//       });

//       socketRef.current.on("error", (error: any) => {
//         console.error("❌ Socket error:", error);
//         dispatch(
//           addEvent(`❌ Error: ${error.message || JSON.stringify(error)}`),
//         );
//       });

//       socketRef.current.on("disconnect", (reason) => {
//         console.log("🔌 Socket disconnected:", reason);
//         dispatch(setConnected(false));
//         dispatch(addEvent(`🔌 Disconnected: ${reason}`));
//       });

//       socketRef.current.on("connect_error", (err) => {
//         console.error("❌ Connection error details:");
//         console.error("- Message:", err.message);
//         // console.error("- Data:", err.data);
//         console.error("- Full Error:", err);
//         dispatch(setConnected(false));
//         dispatch(addEvent(`❌ Connection error: ${err.message}`));
//       });
//     } catch (error) {
//       console.error("Failed to create socket connection:", error);
//       dispatch(addEvent(`❌ Failed to connect: ${error}`));
//     }
//   }, [dispatch, url, accessToken]);

//   const disconnect = useCallback(() => {
//     if (socketRef.current) {
//       socketRef.current.disconnect();
//       socketRef.current = null;
//       dispatch(setConnected(false));
//       dispatch(addEvent("👋 Disconnected manually"));
//     }
//   }, [dispatch]);

//   const sendMessage = useCallback(
//     (params: SendMessageParams) => {
//       if (!socketRef.current?.connected) {
//         console.log("Socket not connected, attempting to connect...");
//         connect();

//         setTimeout(() => {
//           if (socketRef.current?.connected) {
//             sendMessage(params);
//           } else {
//             dispatch(addEvent("❌ Cannot send: Still not connected"));
//           }
//         }, 1500);
//         return false;
//       }

//       try {
//         const payload = {
//           receiverId: String(params.receiverId),
//           content: params.content,
//           messageType: params.messageType,
//         };

//         console.log("📤 Sending message payload:", payload);

//         socketRef.current.emit("send_message", payload, (response: any) => {
//           console.log("Server acknowledgement:", response);

//           if (response && response.success) {
//             dispatch(addEvent("✅ Message delivered to server"));

//             if (response.data) {
//               dispatch(addEvent(`📋 Message ID: ${response.data.id}`));
//             }
//           } else {
//             dispatch(
//               addEvent(
//                 `❌ Server rejected: ${response?.error || "Unknown error"}`,
//               ),
//             );
//           }
//         });

//         const localMsg: Message = {
//           id: `temp-${Date.now()}`,
//           receiverId: String(params.receiverId),
//           senderId: CURRENT_USER_ID,
//           content: params.content,
//           messageType: params.messageType,
//           timestamp: new Date().toISOString(),
//           status: "sending",
//         };

//         dispatch(
//           addMessage({
//             receiverId: String(params.receiverId),
//             message: localMsg,
//           }),
//         );

//         dispatch(addEvent(`📤 Message sent to User ${params.receiverId}`));
//         return true;
//       } catch (error) {
//         console.error("Failed to send message:", error);
//         dispatch(addEvent(`❌ Send failed: ${error}`));
//         return false;
//       }
//     },
//     [dispatch, connect],
//   );

//   return {
//     connect,
//     disconnect,
//     sendMessage,
//     socket: socketRef.current,
//     isConnected: socketRef.current?.connected || false,
//   };
// };
