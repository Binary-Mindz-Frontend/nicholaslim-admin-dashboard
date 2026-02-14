import React, { useState, useEffect, useRef } from "react";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setActiveConversation } from "@/redux/chatSlice";
import {
  useCreateConversationMutation,
  useGetConversationsQuery,
  useGetMessagesQuery,
} from "@/redux/features/chat/chatApi";
import toast from "react-hot-toast";
import { useUploadBulkOrderFileMutation } from "@/redux/features/orderPlacement/orderPlacementApi";
import {
  FiSend,
  FiPaperclip,
  FiRefreshCw,
  FiFileText,
  FiMenu,
  FiSearch,
} from "react-icons/fi";

const SOCKET_URL = "https://api.zipbee.sg";

interface ApiMessage {
  id: string;
  content: string;
  messageType: "TEXT" | "IMAGE" | "PDF";
  fileUrl: string | null;
  isRead: boolean;
  createdAt: string;
  senderId: number;
  receiverId: number;
}

const CURRENT_USER_ID = "1";

const DashboardChat: React.FC = () => {
  const dispatch = useAppDispatch();
  const chatState = useAppSelector((state: any) => state.chat || {});
  const activeConversation = chatState?.activeConversation ?? null;

  const [messageInput, setMessageInput] = useState("");
  const [selectedReceiver, setSelectedReceiver] = useState<string>("2");
  const [sending, setSending] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    data: conversationsResponse,
    isLoading: loadingConversations,
    refetch: refetchConversations,
  } = useGetConversationsQuery(undefined, { pollingInterval: 10000 });

  const {
    data: messagesResponse,
    refetch: refetchMessages,
  } = useGetMessagesQuery(
    { otherUserId: activeConversation || "" },
    { skip: !activeConversation, pollingInterval: 3000 },
  );

  const [createConversation] = useCreateConversationMutation();
  const { connect, disconnect, sendMessage } = useChatSocket(SOCKET_URL);
  const [uploadFile] = useUploadBulkOrderFileMutation();

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesResponse]);

  const currentMessages = (messagesResponse?.data as any)?.messages || [];
  const users =
    conversationsResponse?.data?.map((conv: any) => ({
      id: conv.otherUser.id.toString(),
      email: conv.otherUser.email,
      unreadCount: conv.unreadCount,
      lastMessage: conv.lastMessage,
    })) || [];

  const selectedUser = users.find((u: any) => u.id === selectedReceiver);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedReceiver || sending) return;
    setSending(true);
    try {
      await createConversation({ otherUserId: selectedReceiver }).unwrap();
      sendMessage({
        receiverId: selectedReceiver,
        content: messageInput,
        messageType: "TEXT",
      });
      setMessageInput("");
      setTimeout(() => refetchMessages(), 500);
    } catch (error) {
      toast.error("Message failed");
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
        sendMessage({
          receiverId: selectedReceiver,
          content: res.data[0],
          messageType: file.type.startsWith("image/") ? "IMAGE" : "PDF",
        });
        setTimeout(() => refetchMessages(), 500);
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setSending(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F9FB] text-slate-800 font-sans antialiased overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        fixed lg:relative z-10 w-[320px] h-full bg-white border-r border-slate-200 transition-transform duration-300 ease-out lg:translate-x-0 flex flex-col
      `}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Messages</h2>
          <button
            onClick={refetchConversations}
            className="p-2 text-slate-400 hover:text-[#ff4c00] transition-colors rounded-lg hover:bg-slate-50"
          >
            <FiRefreshCw
              size={18}
              className={loadingConversations ? "animate-spin" : ""}
            />
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="relative flex items-center bg-slate-50 rounded-xl px-4 py-2 border border-slate-100 focus-within:border-orange-200 transition-all">
            <FiSearch className="text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="bg-transparent text-sm outline-none w-full"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
          {users.map((user: any) => (
            <div
              key={user.id}
              onClick={() => {
                setSelectedReceiver(user.id);
                dispatch(setActiveConversation(user.id));
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                activeConversation === user.id
                  ? "bg-orange-50/80 border border-orange-100 shadow-sm"
                  : "hover:bg-slate-50 border border-transparent"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center font-bold text-sm ${activeConversation === user.id ? "bg-[#ff4c00] text-white" : "bg-slate-100 text-slate-500"}`}
              >
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4
                    className={`text-sm font-bold truncate ${activeConversation === user.id ? "text-slate-900" : "text-slate-700"}`}
                  >
                    {user.email.split("@")[0]}
                  </h4>
                  <span className="text-[10px] text-slate-400">12:45 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-500 truncate">
                    {user.lastMessage?.content || "No messages yet"}
                  </p>
                  {user.unreadCount > 0 && (
                    <span className="bg-[#ff4c00] text-white text-[10px] h-4 w-4 flex items-center justify-center rounded-full font-bold ml-2">
                      {user.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-white lg:m-4 lg:rounded-3xl lg:shadow-xl lg:border lg:border-slate-100 overflow-hidden">
        {/* Header */}
        <header className="h-20 px-6 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 bg-slate-50 rounded-lg"
            >
              <FiMenu size={20} />
            </button>
            <div className="relative">
                {
                    currentMessages.length > 0 ? (
                        <div className="flex items-center gap-4">

                        <div className="w-11 h-11 rounded-2xl bg-[#ff4c00] text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-slate-200">
                            {selectedUser?.email.charAt(0).toUpperCase() || "Z"}
                        </div>
                         <h3 className="font-bold text-slate-900 text-[15px] leading-tight">
                {selectedUser?.email || "ZipBee Support"}
              </h3>
                        </div>
                    ) : (
                        <div></div>
                    )
                }
            </div>
            <div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.toptal.com/designers/subtlepatterns/patterns/double-bubble-outline.png')] bg-fixed opacity-[0.98]">
          {currentMessages.map((msg: ApiMessage) => {
            const isOwn = msg.senderId.toString() === CURRENT_USER_ID;
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start animate-in slide-in-from-left-2 duration-300"}`}
              >
                <div className={`max-w-[80%] lg:max-w-[65%] group`}>
                  <div
                    className={`
                    relative px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm
                    ${
                      isOwn
                        ? "bg-[#ff4c00] text-white rounded-br-none shadow-orange-100"
                        : "bg-white text-slate-800 border border-slate-100 rounded-bl-none"
                    }
                  `}
                  >
                    {msg.messageType === "IMAGE" ? (
                      <div className="rounded-lg overflow-hidden border border-black/5">
                        <img
                          src={msg.fileUrl || msg.content}
                          alt="Shared"
                          className="max-h-72 w-full object-cover"
                        />
                      </div>
                    ) : msg.messageType === "PDF" ? (
                      <a
                        href={msg.fileUrl || msg.content}
                        target="_blank"
                        className="flex items-center gap-3 font-medium bg-black/5 p-2 rounded-lg"
                      >
                        <FiFileText size={20} className="text-orange-500" />
                        <span className="truncate">View Document.pdf</span>
                      </a>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                  <div
                    className={`mt-1.5 flex items-center gap-2 ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isOwn && (
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${msg.isRead ? "bg-blue-400" : "bg-slate-200"}`}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <footer className="p-6 bg-white border-t border-slate-50">
          <div className="max-w-4xl mx-auto flex items-end gap-3 bg-slate-50 rounded-3xl p-2 pr-3 border border-slate-100 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-slate-100 transition-all duration-300">
            <label className="p-3 cursor-pointer text-slate-400 hover:text-[#ff4c00] transition-colors rounded-full hover:bg-white">
              <FiPaperclip size={22} />
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleSendFile}
                className="hidden"
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
              placeholder="Type your message..."
              className="flex-1 bg-transparent py-3 px-1 outline-none text-[14px] text-slate-800 placeholder:text-slate-400 resize-none max-h-32"
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim() || sending}
              className="mb-1 p-3 bg-[#ff4c00] text-white rounded-full disabled:bg-slate-200 disabled:shadow-none shadow-lg shadow-orange-200 hover:scale-105 transition-all active:scale-95"
            >
              <FiSend size={20} />
            </button>
          </div>
        </footer>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
      `}</style>
    </div>
  );
};

export default DashboardChat;