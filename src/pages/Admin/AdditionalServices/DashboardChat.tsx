/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setActiveConversation, resetUnreadCount } from "@/redux/chatSlice";
import {
  useCreateConversationMutation,
  useGetConversationsQuery,
  useGetMessagesQuery,
} from "@/redux/features/chat/chatApi";
import { useUploadBulkOrderFileMutation } from "@/redux/features/orderPlacement/orderPlacementApi";
import { FiSend, FiPaperclip, FiFileText, FiMenu } from "react-icons/fi";
import { toast } from "sonner";

const SOCKET_URL = "https://api.zipbee.sg/api/v1/messages";

const DashboardChat: React.FC = () => {
  const dispatch = useAppDispatch();
  const chatState = useAppSelector((state) => state.chat || {});
  const activeConversation = chatState?.activeConversation ?? null;

  const [messageInput, setMessageInput] = useState("");
  const [selectedReceiver, setSelectedReceiver] = useState<string>("");
  const [sending, setSending] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    connect,
    disconnect,
    sendMessage,
    isConnected: socketConnected,
    currentUserId,
  } = useChatSocket(SOCKET_URL);

  const { data: conversationsResponse, refetch: refetchConversations } =
    useGetConversationsQuery(undefined, {
      pollingInterval: 10000,
      skip: !socketConnected,
    });

  const { data: messagesResponse, refetch: refetchMessages } =
    useGetMessagesQuery(
      { otherUserId: activeConversation || "" },
      {
        skip: !activeConversation || !socketConnected,
        pollingInterval: 5000,
      },
    );

  const [createConversation] = useCreateConversationMutation();
  const [uploadFile] = useUploadBulkOrderFileMutation();

  useEffect(() => {
    connect();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => {
      disconnect();
      clearInterval(timer);
    };
  }, [connect, disconnect]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesResponse]);

  useEffect(() => {
    if (conversationsResponse) {
      setIsInitialLoad(false);
    }
  }, [conversationsResponse]);

  const currentMessages = (messagesResponse?.data as any)?.messages || [];

  // Debug: Log messages to check sender IDs
  useEffect(() => {
    if (currentMessages.length > 0) {
      console.log("Current User ID:", currentUserId);
      console.log(
        "Current messages:",
        currentMessages.map((msg: any) => ({
          id: msg.id,
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          isOwn: msg.senderId?.toString() === currentUserId,
          content: msg.content?.substring(0, 30),
          createdAt: new Date(msg.createdAt).toLocaleString(),
        })),
      );
    }
  }, [currentMessages, currentUserId]);

  const users =
    conversationsResponse?.data?.map((conv: any) => {
      const otherUserId = conv.otherUser.id.toString();
      const reduxUnread = chatState.unreadCounts?.[otherUserId] || 0;

      return {
        id: otherUserId,
        email: conv.otherUser.email,
        name: conv.otherUser.email.split("@")[0],
        unreadCount: conv.unreadCount + reduxUnread,
        lastMessage: conv.lastMessage,
        lastMessageTime: conv.lastMessage?.createdAt || conv.updatedAt,
        waitingSince: chatState.lastMessageArrivalTime?.[otherUserId],
      };
    }) || [];

  useEffect(() => {
    if (users.length > 0) {
      const currentUserExists = users.some(
        (u: any) => u.id === selectedReceiver,
      );

      if (!currentUserExists) {
        const firstUserId = users[0].id;
        setSelectedReceiver(firstUserId);
        dispatch(setActiveConversation(firstUserId));
      }
    } else {
      if (selectedReceiver) {
        setSelectedReceiver("");
        dispatch(setActiveConversation(""));
      }
    }
  }, [users, selectedReceiver, dispatch]);

  const selectedUser = users.find((u: any) => u.id === selectedReceiver);

  const handleSendMessage = async () => {
    if (
      !messageInput.trim() ||
      !selectedReceiver ||
      sending ||
      !socketConnected
    ) {
      if (!socketConnected) {
        toast.error("Not connected to chat server");
      }
      return;
    }

    setSending(true);
    const messageContent = messageInput;

    try {
      await createConversation({ otherUserId: selectedReceiver }).unwrap();

      const sent = await sendMessage({
        receiverId: selectedReceiver,
        content: messageContent,
        messageType: "TEXT",
      });

      if (sent) {
        setMessageInput("");
        setTimeout(() => {
          refetchMessages();
          refetchConversations();
        }, 500);
      }
    } catch (error: any) {
      console.error("Send error:", error);
      toast.error(error?.data?.message || "Message failed to send");
    } finally {
      setSending(false);
    }
  };

  const handleSendFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedReceiver || sending) return;
    setSending(true);
    try {
      await createConversation({ otherUserId: selectedReceiver }).unwrap();
      const formData = new FormData();
      formData.append("images", file);
      const res = await uploadFile(formData).unwrap();
      if (res.success) {
        await sendMessage({
          receiverId: selectedReceiver,
          content: res.data[0],
          messageType: file.type.startsWith("image/") ? "IMAGE" : "PDF",
          fileUrl: res.data[0],
        });
        setTimeout(() => refetchMessages(), 500);
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setSending(false);
      e.target.value = "";
    }
  };

  const formatTime = (timestamp: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const getWaitTime = (timestamp: string) => {
    if (!timestamp) return "";
    const start = new Date(timestamp);
    const diff = currentTime.getTime() - start.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return "Just now";
    if (hours === 0) return `${minutes}m`;
    if (hours < 24) return `${hours}h ${minutes % 60}m`;
    return `${Math.floor(hours / 24)}d`;
  };

  // Function to determine if message is from current user
  const isOwnMessage = (msg: any) => {
    if (!currentUserId) return false;

    // Convert both to strings for comparison
    const senderId = msg.senderId?.toString();
    const currentId = currentUserId.toString();

    // Also check if this is a temporary message we just sent
    const isTempMessage = msg.id?.toString().startsWith("temp-");

    // If it's a temp message, it's definitely ours
    if (isTempMessage) return true;

    // Otherwise compare sender ID with current user ID
    return senderId === currentId;
  };

  // Group messages by date
  const groupMessagesByDate = (messages: any[]) => {
    const groups: { [key: string]: any[] } = {};

    messages.forEach((msg) => {
      const date = formatDate(msg.createdAt || msg.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate(currentMessages);

  return (
    <div className="flex h-[90vh] bg-[#F8F9FB] text-slate-800 font-sans antialiased overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed lg:relative z-50 lg:z-10 w-[320px] h-full bg-white border-r border-slate-200 transition-transform duration-300 ease-out lg:translate-x-0 flex flex-col`}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Messages</h2>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {users.length === 0 ? (
            <div className="text-center text-slate-400 py-8 text-sm">
              {isInitialLoad
                ? "Loading conversations..."
                : "No conversations yet"}
            </div>
          ) : (
            users.map((user: any) => (
              <div
                key={user.id}
                onClick={() => {
                  setSelectedReceiver(user.id);
                  dispatch(setActiveConversation(user.id));
                  dispatch(resetUnreadCount(user.id));
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 relative ${
                  activeConversation === user.id
                    ? "bg-orange-50/80 border border-orange-100 shadow-sm"
                    : user.unreadCount > 0
                      ? "bg-white border-orange-200 shadow-md animate-pulse border-2"
                      : "hover:bg-slate-50 border border-transparent"
                }`}
              >
                {user.unreadCount > 0 && activeConversation !== user.id && (
                  <div className="absolute -top-1 -right-1 bg-[#ff4c00] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg z-10">
                    {user.unreadCount > 9 ? "9+" : user.unreadCount}
                  </div>
                )}
                <div
                  className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center font-bold text-sm ${
                    activeConversation === user.id
                      ? "bg-[#ff4c00] text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4
                      className={`text-sm font-bold truncate ${
                        activeConversation === user.id
                          ? "text-slate-900"
                          : "text-slate-700"
                      }`}
                    >
                      {user.name}
                    </h4>
                    {user.lastMessageTime && (
                      <span className="text-[10px] text-slate-400">
                        {formatTime(user.lastMessageTime)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-xs truncate ${user.unreadCount > 0 && activeConversation !== user.id ? "text-slate-900 font-bold" : "text-slate-500"}`}>
                      {user.lastMessage?.content || "No messages yet"}
                    </p>
                    {user.waitingSince && activeConversation !== user.id && (
                      <span className="text-[10px] text-[#ff4c00] font-bold bg-orange-50 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">
                        Wait: {getWaitTime(user.waitingSince)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-white lg:m-4 lg:rounded-3xl lg:shadow-xl lg:border lg:border-slate-100 overflow-hidden pt-6">
        {selectedUser ? (
          <>
            <header className="h-20 px-6 border-b border-slate-50 flex items-center bg-white/80 backdrop-blur-md">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 bg-slate-50 rounded-lg mr-4"
              >
                <FiMenu size={20} />
              </button>
              <div className="flex items-center gap-4 no-scrollbar">
                <div className="w-11 h-11 rounded-2xl bg-[#ff4c00] text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-slate-200">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-[15px]">
                    {selectedUser.name}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedUser.email}</p>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 bg-[url('https://www.toptal.com/designers/subtlepatterns/patterns/double-bubble-outline.png')] bg-fixed opacity-[0.98]">
              {currentMessages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400">
                  No messages yet. Say hello!
                </div>
              ) : (
                Object.entries(messageGroups).map(([date, messages]) => (
                  <div key={date} className="space-y-4">
                    <div className="flex justify-center">
                      <span className="text-xs bg-slate-200 text-slate-600 px-3 py-1 rounded-full">
                        {date}
                      </span>
                    </div>
                    {messages.map((msg: any) => {
                      const isOwn = isOwnMessage(msg);
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-[80%] lg:max-w-[65%] group`}>
                            <div
                              className={`relative px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm
                              ${
                                isOwn
                                  ? "bg-[#ff4c00] text-white rounded-br-none shadow-orange-100"
                                  : "bg-white text-slate-800 border border-slate-100 rounded-bl-none"
                              }`}
                            >
                              {msg.messageType === "IMAGE" ? (
                                <div className="rounded-lg overflow-hidden border border-black/5">
                                  <img
                                    src={msg.fileUrl || msg.content}
                                    alt="Shared"
                                    className="max-h-72 w-full object-cover cursor-pointer hover:opacity-90 transition"
                                    onClick={() =>
                                      window.open(
                                        msg.fileUrl || msg.content,
                                        "_blank",
                                      )
                                    }
                                  />
                                </div>
                              ) : msg.messageType === "PDF" ? (
                                <a
                                  href={msg.fileUrl || msg.content}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 font-medium hover:underline"
                                >
                                  <FiFileText size={20} />
                                  <span className="truncate">Document.pdf</span>
                                </a>
                              ) : (
                                <p className="whitespace-pre-wrap wrap-break-word">
                                  {msg.content}
                                </p>
                              )}
                            </div>
                            <div
                              className={`mt-1.5 flex items-center gap-2 ${isOwn ? "justify-end" : "justify-start"}`}
                            >
                              <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">
                                {new Date(
                                  msg.createdAt || msg.timestamp,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              {isOwn && msg.status === "sending" && (
                                <span className="text-[10px] text-slate-400">
                                  Sending...
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <footer className="p-6 bg-white border-t border-slate-50">
              <div className="max-w-4xl mx-auto flex items-end gap-3 bg-slate-50 rounded-3xl p-2 pr-3 border border-slate-100 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-slate-100 transition-all duration-300">
                <label className="p-3 cursor-pointer text-slate-400 hover:text-[#ff4c00] transition-colors rounded-full hover:bg-white">
                  <FiPaperclip size={22} />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleSendFile}
                    className="hidden"
                    disabled={!socketConnected || sending}
                  />
                </label>
                <textarea
                  rows={1}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={
                    socketConnected ? "Type your message..." : "Connecting..."
                  }
                  disabled={!socketConnected || sending}
                  className="flex-1 bg-transparent py-3 px-1 outline-none text-[14px] text-slate-800 placeholder:text-slate-400 resize-none max-h-32 disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || sending || !socketConnected}
                  className="mb-1 p-3 bg-[#ff4c00] text-white rounded-full disabled:bg-slate-200 disabled:shadow-none shadow-lg shadow-orange-200 hover:scale-105 transition-all active:scale-95 disabled:cursor-not-allowed"
                >
                  <FiSend size={20} />
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">
            Select a conversation to start chatting
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardChat;
