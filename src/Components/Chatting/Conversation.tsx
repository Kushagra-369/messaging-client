import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { APIURL } from "../../GlobalAPIURL";
import {
  MessageCircle,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Send,
  ChevronLeft,
  Check,
  CheckCheck,
  Phone,
  Video,
  Info,
  Users,
  Plus,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

interface User {
  _id: string;
  username: string;
  first_name: string;
  last_name: string;
  profileImg?: {
    public_id?: string;
    secure_url: string;
  };
  isOnline: boolean;
  status?: string;
  bio?: string;
  gender?: string;
}

interface Message {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Conversation {
  _id: string;
  user: User;
  lastMessage: {
    content: string;
    createdAt: string;
    sender: string;
    receiver: string;
  };
  unreadCount: number;
}

export default function Conversation() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarWidth, setSidebarWidth] = useState(380);
  const [isResizing, setIsResizing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id || null;
    } catch {
      return null;
    }
  };

  const token = localStorage.getItem("access_token");
  const currentUserId = getUserIdFromToken();

  // Resizable sidebar
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !sidebarRef.current) return;
      const newWidth = e.clientX;
      if (newWidth >= 300 && newWidth <= 600) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };

    if (isResizing) {
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(`${APIURL}/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConversations(res.data.conversations || []);

        if (userId && res.data.conversations) {
          const conv = res.data.conversations.find(
            (c: Conversation) => c.user._id === userId
          );
          if (conv) {
            setSelectedUser(conv.user);
            fetchMessages(conv.user._id);
          }
        }
      } catch (err) {
        console.error("Error fetching conversations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, [token, userId]);

  const fetchMessages = async (targetUserId: string) => {
    if (!token || !targetUserId) return;

    setLoadingMessages(true);
    try {
      const res = await axios.get(`${APIURL}/get_messages/${targetUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        const sortedMessages = (res.data.messages || []).sort(
          (a: Message, b: Message) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setMessages(sortedMessages);
        await markMessagesAsRead(targetUserId);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const markMessagesAsRead = async (senderId: string) => {
    try {
      await axios.post(
        `${APIURL}/mark_messages_read`,
        { senderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setConversations((prev) =>
        prev.map((conv) =>
          conv.user._id === senderId ? { ...conv, unreadCount: 0 } : conv
        )
      );
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !token) return;

    setSending(true);
    try {
      const res = await axios.post(
        `${APIURL}/send_message`,
        {
          receiverId: selectedUser._id,
          content: newMessage.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const updatedMessages = [...messages, res.data.data].sort(
          (a: Message, b: Message) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setMessages(updatedMessages);
        setNewMessage("");

        setConversations((prev) =>
          prev.map((conv) =>
            conv.user._id === selectedUser._id
              ? {
                  ...conv,
                  lastMessage: {
                    content: newMessage,
                    createdAt: new Date().toISOString(),
                    sender: currentUserId || "",
                    receiver: selectedUser._id,
                  },
                  unreadCount: 0,
                }
              : conv
          )
        );
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedUser(conversation.user);
    navigate(`/conversation/${conversation.user._id}`, { replace: true });
    fetchMessages(conversation.user._id);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatMessagePreview = (content: string, senderId: string) => {
    if (!content) return "Start a conversation";
    const prefix = senderId === currentUserId ? "You: " : "";
    return prefix + (content.length > 30 ? content.substring(0, 30) + "..." : content);
  };

  const getUserInitials = (user: User) => {
    if (user.first_name) {
      return user.first_name.charAt(0).toUpperCase();
    }
    if (user.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return "U";
  };

  const isMessageFromCurrentUser = (senderId: string) => {
    return senderId?.toString() === currentUserId?.toString();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (newMessage.trim() && !sending) {
        sendMessage(e as any);
      }
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    `${conv.user.first_name} ${conv.user.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-500" />
          <p className="mt-4 text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        style={{ width: sidebarWidth }}
        className="relative flex flex-col border-r border-gray-200 bg-white transition-all duration-150"
      >
        {/* Resize handle */}
        <div
          className={`absolute -right-2 top-0 z-20 h-full w-4 cursor-col-resize ${isResizing ? "bg-blue-100" : ""}`}
          onMouseDown={() => setIsResizing(true)}
        />

        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Messages</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </button>
            <button className="rounded-lg p-2 hover:bg-gray-100">
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="border-b border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 rounded-full bg-blue-100 p-6">
                <MessageCircle className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                {searchQuery ? "No matches found" : "No conversations yet"}
              </h3>
              <p className="mb-6 text-gray-600">
                {searchQuery
                  ? "Try searching with a different name"
                  : "Start a new chat to begin messaging"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => navigate("/")}
                  className="rounded-lg bg-blue-500 px-6 py-2 font-medium text-white transition hover:bg-blue-600"
                >
                  Start Chatting
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredConversations.map((conv) => (
                <div
                  key={conv._id}
                  className={`flex cursor-pointer items-center gap-3 p-4 transition hover:bg-gray-50 ${selectedUser?._id === conv.user._id ? "bg-blue-50" : ""}`}
                  onClick={() => handleConversationClick(conv)}
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div className="h-12 w-12 overflow-hidden rounded-full">
                      {conv.user.profileImg?.secure_url ? (
                        <img
                          src={conv.user.profileImg.secure_url}
                          alt={conv.user.username}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-400 to-purple-500 text-white">
                          <span className="font-semibold">
                            {getUserInitials(conv.user)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${conv.user.isOnline ? "bg-green-500" : "bg-gray-300"}`}
                    />
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="truncate font-medium text-gray-900">
                        {conv.user.first_name} {conv.user.last_name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {conv.lastMessage && formatTime(conv.lastMessage.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm text-gray-600">
                        {conv.lastMessage
                          ? formatMessagePreview(conv.lastMessage.content, conv.lastMessage.sender)
                          : "Start a conversation"}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1.5 text-xs font-medium text-white">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    navigate("/conversation", { replace: true });
                  }}
                  className="md:hidden rounded-lg p-2 hover:bg-gray-100"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-10 w-10 overflow-hidden rounded-full">
                      {selectedUser.profileImg?.secure_url ? (
                        <img
                          src={selectedUser.profileImg.secure_url}
                          alt={selectedUser.username}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-400 to-purple-500 text-white">
                          <span className="font-semibold">
                            {getUserInitials(selectedUser)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${selectedUser.isOnline ? "bg-green-500" : "bg-gray-300"}`}
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {selectedUser.first_name} {selectedUser.last_name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {selectedUser.isOnline ? "Online" : "Offline"} •{" "}
                      {selectedUser.status || "Available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Actions */}
              <div className="flex items-center gap-2">
                <button className="rounded-full p-2 hover:bg-gray-100">
                  <Phone className="h-5 w-5 text-gray-600" />
                </button>
                <button className="rounded-full p-2 hover:bg-gray-100">
                  <Video className="h-5 w-5 text-gray-600" />
                </button>
                <button className="rounded-full p-2 hover:bg-gray-100">
                  <Info className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-linear-to-b from-gray-50 to-gray-100 p-4">
              {loadingMessages ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center">
                  <div className="mb-4 rounded-full bg-blue-100 p-8">
                    <MessageCircle className="h-16 w-16 text-blue-500" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-800">
                    Start a conversation
                  </h3>
                  <p className="text-gray-600">
                    Send your first message to {selectedUser.first_name}!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isSender = isMessageFromCurrentUser(message.sender);
                    return (
                      <div
                        key={message._id}
                        className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${isSender
                              ? "rounded-br-none bg-blue-500 text-white"
                              : "rounded-bl-none bg-white text-gray-900 shadow-sm"
                            }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div
                            className={`mt-1 flex items-center justify-end gap-1 text-xs ${isSender ? "text-blue-100" : "text-gray-500"}`}
                          >
                            <span>{formatTime(message.createdAt)}</span>
                            {isSender && (
                              <span>
                                {message.isRead ? (
                                  <CheckCheck className="h-3 w-3" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="border-t border-gray-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <Paperclip className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  type="button"
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <ImageIcon className="h-5 w-5 text-gray-600" />
                </button>
                <div className="flex-1">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    disabled={sending}
                  />
                </div>
                <button
                  type="button"
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <Smile className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="rounded-full bg-blue-500 p-3 text-white transition hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-linear-to-br from-gray-50 to-blue-50 p-8">
            <div className="mb-8 rounded-full bg-white p-8 shadow-lg">
              <MessageCircle className="h-20 w-20 text-blue-500" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Welcome to Messages
            </h2>
            <p className="mb-8 max-w-md text-center text-gray-600">
              Select a conversation from the list or start a new chat to begin messaging
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/")}
                className="rounded-full bg-blue-500 px-6 py-3 font-medium text-white transition hover:bg-blue-600"
              >
                <Users className="mr-2 inline-block h-5 w-5" />
                Browse Users
              </button>
              <button
                onClick={() => navigate("/")}
                className="rounded-full border border-blue-500 bg-white px-6 py-3 font-medium text-blue-500 transition hover:bg-blue-50"
              >
                <Plus className="mr-2 inline-block h-5 w-5" />
                New Group
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}