import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { APIURL } from "../../GlobalAPIURL";
import './Conversation.css';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const token = localStorage.getItem("access_token");
  const currentUserId = localStorage.getItem("userId");

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(`${APIURL}/conversations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConversations(res.data.conversations || []);
        
        // If there's a userId in URL, select that conversation
        if (userId && res.data.conversations) {
          const conv = res.data.conversations.find((c: Conversation) => c.user._id === userId);
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
    
    // Refresh conversations every 10 seconds
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, [token, userId]);

  // Fetch messages for selected user
  const fetchMessages = async (targetUserId: string) => {
    if (!token || !targetUserId) return;
    
    setLoadingMessages(true);
    try {
      const res = await axios.get(`${APIURL}/get_messages/${targetUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setMessages(res.data.messages || []);
        
        // Mark messages as read
        await markMessagesAsRead(targetUserId);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async (senderId: string) => {
    try {
      await axios.post(`${APIURL}/mark_messages_read`, 
        { senderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update unread count locally
      setConversations(prev => prev.map(conv => 
        conv.user._id === senderId ? { ...conv, unreadCount: 0 } : conv
      ));
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  };

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !token) return;

    setSending(true);
    try {
      const res = await axios.post(`${APIURL}/send_message`, 
        {
          receiverId: selectedUser._id,
          content: newMessage.trim()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        // Add message to list
        setMessages(prev => [...prev, res.data.data]);
        setNewMessage("");
        
        // Update last message in conversations
        setConversations(prev => prev.map(conv => 
          conv.user._id === selectedUser._id 
            ? { 
                ...conv, 
                lastMessage: {
                  content: newMessage,
                  createdAt: new Date().toISOString(),
                  sender: currentUserId || "",
                  receiver: selectedUser._id
                },
                unreadCount: 0
              }
            : conv
        ));
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  // Handle conversation click - DON'T NAVIGATE, just set selected user
  const handleConversationClick = (conversation: Conversation) => {
    setSelectedUser(conversation.user);
    // Only update URL without navigating away
    navigate(`/conversation/${conversation.user._id}`, { replace: true });
    fetchMessages(conversation.user._id);
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Format message preview
  const formatMessagePreview = (content: string, senderId: string) => {
    if (!content) return 'Start a conversation';
    const prefix = senderId === currentUserId ? 'You: ' : '';
    return prefix + (content.length > 30 ? content.substring(0, 30) + '...' : content);
  };

  // Get user initials
  const getUserInitials = (user: User) => {
    if (user.first_name) {
      return user.first_name.charAt(0).toUpperCase();
    }
    if (user.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (newMessage.trim() && !sending) {
        sendMessage(e as any);
      }
    }
  };

  if (loading) {
    return (
      <div className="conversation-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="conversation-container">
      {/* Sidebar */}
      <div className="conversation-sidebar">
        <div className="sidebar-header">
          <h2>Messages</h2>
          <button 
            className="new-chat-btn"
            onClick={() => navigate('/')}
          >
            New Chat
          </button>
        </div>

        {conversations.length === 0 ? (
          <div className="no-conversations">
            <div className="empty-icon">💬</div>
            <h3>No conversations yet</h3>
            <p>Start a new chat to begin messaging</p>
            <button 
              className="start-chat-btn"
              onClick={() => navigate('/')}
            >
              Start Chatting
            </button>
          </div>
        ) : (
          <div className="conversation-list">
            {conversations.map(conv => (
              <div
                key={conv._id}
                className={`conversation-item ${
                  selectedUser?._id === conv.user._id ? 'active' : ''
                }`}
                onClick={() => handleConversationClick(conv)}
              >
                <div className="conversation-avatar">
                  {conv.user.profileImg?.secure_url ? (
                    <img
                      src={conv.user.profileImg.secure_url}
                      alt={conv.user.username}
                      className="avatar-img"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : null}
                  {!conv.user.profileImg?.secure_url && (
                    <div className="avatar-placeholder">
                      {getUserInitials(conv.user)}
                    </div>
                  )}
                  <div className={`online-status ${conv.user.isOnline ? 'online' : 'offline'}`}></div>
                </div>

                <div className="conversation-info">
                  <div className="conversation-header">
                    <h3 className="conversation-name">
                      {conv.user.first_name} {conv.user.last_name}
                    </h3>
                    <span className="conversation-time">
                      {conv.lastMessage && formatTime(conv.lastMessage.createdAt)}
                    </span>
                  </div>

                  <div className="conversation-preview">
                    <p className="last-message">
                      {conv.lastMessage 
                        ? formatMessagePreview(conv.lastMessage.content, conv.lastMessage.sender)
                        : 'Start a conversation'}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="unread-badge">
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

      {/* Main Chat Area */}
      <div className="conversation-chat-area">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <button 
                className="back-button"
                onClick={() => {
                  setSelectedUser(null);
                  navigate('/conversation', { replace: true });
                }}
                aria-label="Back to conversations"
              >
                ←
              </button>
              
              <div className="chat-user-info">
                <div className="chat-avatar">
                  {selectedUser.profileImg?.secure_url ? (
                    <img
                      src={selectedUser.profileImg.secure_url}
                      alt={selectedUser.username}
                      className="avatar-img"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      {getUserInitials(selectedUser)}
                    </div>
                  )}
                  <div className={`online-status ${selectedUser.isOnline ? 'online' : 'offline'}`}></div>
                </div>
                
                <div className="chat-user-details">
                  <h2 className="chat-user-name">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </h2>
                  <p className="chat-user-status">
                    {selectedUser.isOnline ? 'Online' : 'Offline'} • {selectedUser.status || 'Available'}
                  </p>
                  {selectedUser.bio && (
                    <p className="chat-user-bio">
                      {selectedUser.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="chat-messages">
              {loadingMessages ? (
                <div className="loading-messages">
                  <div className="spinner"></div>
                  <p>Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="no-messages">
                  <div className="message-icon">💬</div>
                  <h3>Start a conversation</h3>
                  <p>Send your first message to {selectedUser.first_name}!</p>
                </div>
              ) : (
                <div className="messages-wrapper">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`message-bubble ${
                        message.sender === currentUserId ? 'sent' : 'received'
                      }`}
                    >
                      <div className="message-content">
                        <p>{message.content}</p>
                        <span className="message-time">
                          {formatTime(message.createdAt)}
                          {message.sender === currentUserId && (
                            <span className="read-status">
                              {message.isRead ? '✓✓' : '✓'}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="message-input-area">
              <div className="input-wrapper">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="message-input"
                  disabled={sending}
                />
                
                <button 
                  type="submit" 
                  className="send-button"
                  disabled={!newMessage.trim() || sending}
                >
                  {sending ? (
                    <div className="send-spinner"></div>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="select-chat-icon">👋</div>
            <h2>Select a conversation</h2>
            <p>Choose a chat from the list to start messaging</p>
            <button 
              className="browse-chats-btn"
              onClick={() => navigate('/')}
            >
              Browse Users
            </button>
          </div>
        )}
      </div>
    </div>
  );
}