import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APIURL } from "../../GlobalAPIURL";
import './Chatting.css';

interface User {
  _id: string;
  username: string;
  first_name: string;
  last_name: string;
  profileImg: {
    public_id: string;
    secure_url: string;
  };
  gender: string;
  bio: string;
  isOnline: boolean;
  status: string;
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

interface ChatState {
  user: User;
  chatId?: string;
}

interface ApiResponse {
  success: boolean;
  messages: Message[];
  message?: string;
}

interface SendMessageResponse {
  success: boolean;
  message: string; // Message text from server
  data: Message;   // Actual message data
}

export default function Chatting() {
  const location = useLocation();
  const navigate = useNavigate();
  const [state] = useState<ChatState | null>(location.state as ChatState);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get token and current user ID
  const token = localStorage.getItem('access_token');
  const currentUserId = localStorage.getItem('userId');

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch messages when component mounts
  useEffect(() => {
   

    fetchMessages();
    
    // Set up polling for new messages every 3 seconds
    const intervalId = setInterval(fetchMessages, 3000);
    
    return () => clearInterval(intervalId);
  }, [state?.user?._id, token, currentUserId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const fetchMessages = async () => {
    if (!state?.user?._id || !token || !currentUserId) return;

    try {
      // Only set loading on initial load
      if (messages.length === 0) {
        setLoading(true);
      }
      
      const response = await axios.get<ApiResponse>(
        `${APIURL}/get_messages/${state.user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setMessages(response.data.messages || []);
      }
    } catch (err: any) {
      console.error('Failed to fetch messages:', err);
      
      if (err.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('userId');
        return;
      }
      
      // Show error only if it's not a 404 (no messages is normal for new chats)
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || 'Failed to load messages.');
      }
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !state?.user?._id || !token || !currentUserId) return;

    const messageToSend = {
      receiverId: state.user._id,
      content: newMessage.trim(),
    };

    setSending(true);

    try {
      const response = await axios.post<SendMessageResponse>(
        `${APIURL}/send_message`,
        messageToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        // Add the new message to the messages array
        // Your backend returns the message in 'data' field
        if (response.data.data) {
          setMessages(prev => [...prev, response.data.data]);
        }
        setNewMessage('');
        
        // Refocus input
        inputRef.current?.focus();
        
        // Clear any errors
        setError('');
      }
    } catch (err: any) {
      console.error('Failed to send message:', err);
      
      if (err.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('userId');
        navigate('/login');
        return;
      }
      
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Optional: Mark messages as read when user is viewing them
  const markMessagesAsRead = async () => {
    if (!state?.user?._id || !token || !currentUserId) return;

    try {
      await axios.post(
        `${APIURL}/mark_messages_read`,
        {
          senderId: state.user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (err) {
      console.error('Failed to mark messages as read:', err);
    }
  };

  // Call markMessagesAsRead when messages are loaded
  useEffect(() => {
    if (messages.length > 0 && state?.user?._id && token && currentUserId) {
      const unreadMessages = messages.filter(
        msg => msg.sender === state.user._id && !msg.isRead
      );
      if (unreadMessages.length > 0) {
        markMessagesAsRead();
      }
    }
  }, [messages, state?.user?._id, token, currentUserId]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString();
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  // Get user initials for avatar placeholder
  const getUserInitials = () => {
    if (!state?.user) return 'U';
    if (state.user.first_name) {
      return state.user.first_name.charAt(0).toUpperCase();
    }
    if (state.user.username) {
      return state.user.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Function to check if a message is sent by current user
  const isMessageSentByCurrentUser = (message: Message) => {
    return message.sender === currentUserId || message.sender === currentUserId;
  };

  if (!state?.user) {
    return (
      <div className="chatting-container">
        <div className="chatting-error">
          <h2>No chat selected</h2>
          <p>Please select a user to start chatting</p>
          <button onClick={() => navigate('/')}>Go Back</button>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate();

  return (
    <div className="chatting-container">
      {/* Header with User Info */}
      <div className="chatting-header">
        <button 
          onClick={() => navigate('/')}
          className="back-button"
          aria-label="Go back"
        >
          ←
        </button>
        
        <div className="user-info">
          <div className="user-avatar">
            {state.user.profileImg?.secure_url ? (
              <img 
                src={state.user.profileImg.secure_url} 
                alt={state.user.username}
                className="avatar-img"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : null}
            {!state.user.profileImg?.secure_url && (
              <div className="avatar-placeholder">
                {getUserInitials()}
              </div>
            )}
            <div 
              className={`online-status ${state.user.isOnline ? 'online' : 'offline'}`}
              title={state.user.isOnline ? 'Online' : 'Offline'}
            ></div>
          </div>
          
          <div className="user-details">
            <h2 className="user-name">
              {state.user.first_name} {state.user.last_name}
            </h2>
            <p className="user-status">
              {state.user.isOnline ? 'Online' : 'Offline'} • {state.user.status || 'Available'}
            </p>
            {state.user.bio && (
              <p className="user-bio" title={state.user.bio}>
                {state.user.bio.length > 30 ? state.user.bio.substring(0, 30) + '...' : state.user.bio}
              </p>
            )}
          </div>
        </div>
        
        <div className="header-actions">
          <button className="action-button" aria-label="More options">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </button>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="chatting-messages">
        {loading && messages.length === 0 ? (
          <div className="loading-messages">
            <div className="spinner"></div>
            <p>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="no-messages">
            <div className="message-icon">💬</div>
            <h3>Start a conversation</h3>
            <p>Send your first message to {state.user.first_name}!</p>
          </div>
        ) : (
          <div className="messages-wrapper">
            {Object.entries(messageGroups).map(([date, dateMessages]) => (
              <div key={date} className="date-group">
                <div className="date-divider">
                  <span>{formatDate(date)}</span>
                </div>
                
                {dateMessages.map((message) => (
                  <div
                    key={message._id}
                    className={`message-bubble ${
                      isMessageSentByCurrentUser(message) ? 'sent' : 'received'
                    }`}
                  >
                    <div className="message-content">
                      <p>{message.content}</p>
                      <span className="message-time">
                        {formatTime(message.createdAt)}
                        {isMessageSentByCurrentUser(message) && (
                          <span className="read-status">
                            {message.isRead ? '✓✓' : '✓'}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input Area */}
      <form onSubmit={sendMessage} className="message-input-area">
        {error && (
          <div className="error-message">
            {error}
            <button 
              type="button" 
              onClick={() => setError('')}
              aria-label="Close error message"
            >
              ×
            </button>
          </div>
        )}
        
        <div className="input-wrapper">
          <button 
            type="button" 
            className="attach-button"
            aria-label="Attach file"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
            </svg>
          </button>
          
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="message-input"
            disabled={sending}
            aria-label="Type your message"
            onKeyDown={(e) => {
              // Send message on Enter key (without Shift)
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (newMessage.trim() && !sending) {
                  sendMessage(e as any);
                }
              }
            }}
          />
          
          <button 
            type="submit" 
            className="send-button"
            disabled={!newMessage.trim() || sending}
            aria-label="Send message"
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
    </div>
  );
}