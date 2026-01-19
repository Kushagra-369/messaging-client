import { useState } from 'react';
import type { FormEvent } from 'react'; import axios from 'axios';
import { APIURL } from "../../GlobalAPIURL";
import { useNavigate } from 'react-router-dom';
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

interface ApiResponse {
  success: boolean;
  user: User;
  message?: string;
}

export default function Home() {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setSearchResults(null);

    try {
      const response = await axios.get<ApiResponse>(
        `${APIURL}/find_user_by_username/${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        setSearchResults(response.data.user);
      } else {
        setError('User not found');
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || 'Failed to search user');
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async (_userId: string) => {
    try {
      const response = await axios.get<ApiResponse>(
        `${APIURL}/find_user_by_username/${searchQuery}`
      );

      if (response.data.success) {
        navigate('/chat', {
          state: {
            user: response.data.user,
            chatId: 'existing_or_new_chat_id' // Optional
          }
        });
      }
    } catch (err) {
      console.error('Failed to start chat:', err);
    }
  };

  const handleCloseModal = () => {
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults(null);
    setError('');
  };

  return (
    <main
      className="
        min-h-[calc(100vh-64px)]
        flex flex-col items-center justify-center
        px-4
        transition-colors duration-300
        bg-transparent
      "
    >
      {/* Hero Card */}
      <div
        className="
          w-full max-w-3xl
          rounded-2xl
          border
          border-gray-200 dark:border-gray-700
          shadow-lg dark:shadow-gray-900/40
          p-6 md:p-10
          text-center
        "
      >
        {/* Icon */}
        <div
          className="
            text-5xl mb-4
            animate-bounce
          "
        >
          💬
        </div>

        {/* Title */}
        <h1
          className="
            text-2xl md:text-3xl
            font-bold
            text-gray-800 dark:text-white
            mb-3
          "
        >
          Welcome to ChatApp
        </h1>

        {/* Subtitle */}
        <p
          className="
            text-gray-600 dark:text-gray-400
            max-w-xl mx-auto
            mb-8
          "
        >
          Start conversations, share ideas, and stay connected — all in one
          place. Your messages stay in sync across light and dark modes.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setShowSearch(true)}
            className="
              px-6 py-3 rounded-xl
              bg-blue-600 hover:bg-blue-700
              text-white font-medium
              transition-all duration-200
              hover:scale-[1.02]
              shadow-md
            "
          >
            Start New Chat
          </button>

          <button
            className="
              px-6 py-3 rounded-xl
              border
              border-gray-300 dark:border-gray-600
              text-gray-700 dark:text-gray-300
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition-all duration-200
            "
          >
            View Conversations
          </button>
        </div>
      </div>

      {/* Search Modal Overlay */}
      {showSearch && (
        <div
          className="
            fixed inset-0
            bg-black/50 dark:bg-black/70
            flex items-center justify-center
            p-4
            z-50
            backdrop-blur-sm
          "
          onClick={handleCloseModal}
        >
          {/* Search Box */}
          <div
            className="
              w-full max-w-md
              rounded-2xl
              border
              border-gray-200 dark:border-gray-700
              shadow-2xl dark:shadow-gray-900/50
              p-6
              bg-white dark:bg-gray-900
              max-h-[90vh] overflow-y-auto
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className="
                  text-xl font-bold
                  text-gray-800 dark:text-white
                "
              >
                {searchResults ? 'User Found' : 'Search User'}
              </h2>

              {searchResults && (
                <button
                  onClick={() => {
                    setSearchResults(null);
                    setSearchQuery('');
                    setError('');
                  }}
                  className="
                    px-3 py-1
                    text-sm
                    rounded-lg
                    border
                    border-gray-300 dark:border-gray-600
                    text-gray-700 dark:text-gray-300
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    transition-colors duration-200
                  "
                >
                  ← Back
                </button>
              )}
            </div>

            {!searchResults ? (
              <form onSubmit={handleSearch}>
                <div className="relative mb-6">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    placeholder="Enter username..."
                    className="
                      w-full
                      px-4 py-3
                      rounded-xl
                      border
                      border-gray-300 dark:border-gray-600
                      bg-gray-50 dark:bg-gray-800
                      text-gray-900 dark:text-white
                      focus:outline-none focus:ring-2
                      focus:ring-blue-500 dark:focus:ring-blue-400
                      focus:border-transparent
                      transition-all duration-200
                    "
                    autoFocus
                  />
                  <div className="absolute right-3 top-3 text-gray-400">
                    🔍
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="
                      flex-1
                      px-4 py-3
                      rounded-xl
                      border
                      border-gray-300 dark:border-gray-600
                      text-gray-700 dark:text-gray-300
                      hover:bg-gray-100 dark:hover:bg-gray-800
                      transition-colors duration-200
                      font-medium
                    "
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="
                      flex-1
                      px-4 py-3
                      rounded-xl
                      bg-blue-600 hover:bg-blue-700
                      text-white
                      font-medium
                      transition-colors duration-200
                      disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center justify-center gap-2
                    "
                    disabled={!searchQuery.trim() || loading}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Searching...
                      </>
                    ) : (
                      'Search'
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div>
                {/* User Profile Card */}
                <div
                  className="
                    rounded-xl
                    border
                    border-gray-200 dark:border-gray-700
                    p-5 mb-6
                    bg-gray-50 dark:bg-gray-800/50
                  "
                >
                  <div className="flex flex-col items-center mb-4">
                    <div className="relative mb-4">
                      {searchResults.profileImg?.secure_url ? (
                        <img
                          src={searchResults.profileImg.secure_url}
                          alt={searchResults.username}
                          className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl">
                          {searchResults.first_name?.charAt(0) || '👤'}
                        </div>
                      )}

                      <div
                        className={`
                          absolute bottom-2 right-2
                          w-4 h-4 rounded-full border-2 border-white dark:border-gray-800
                          ${searchResults.isOnline ? 'bg-green-500' : 'bg-gray-400'}
                        `}
                      ></div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      {searchResults.first_name} {searchResults.last_name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      @{searchResults.username}
                    </p>

                    <span
                      className="
                        mt-2 px-3 py-1
                        text-xs font-medium
                        rounded-full
                        bg-blue-100 dark:bg-blue-900
                        text-blue-800 dark:text-blue-200
                      "
                    >
                      {searchResults.gender}
                    </span>
                  </div>

                  {searchResults.bio && (
                    <div className="text-center mb-4">
                      <p className="text-gray-700 dark:text-gray-300 italic">
                        "{searchResults.bio}"
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span
                      className={`
                        w-2 h-2 rounded-full
                        ${searchResults.isOnline ? 'bg-green-500' : 'bg-gray-400'}
                      `}
                    ></span>
                    {searchResults.isOnline ? 'Online' : 'Offline'} • {searchResults.status}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleStartChat(searchResults._id)}
                    className="
                      w-full
                      px-4 py-3
                      rounded-xl
                      bg-green-600 hover:bg-green-700
                      text-white
                      font-medium
                      transition-colors duration-200
                      flex items-center justify-center gap-2
                    "
                  >
                    <span>💬</span>
                    Start Chat
                  </button>

                  <button
                    onClick={() => {
                      setSearchResults(null);
                      setSearchQuery('');
                    }}
                    className="
                      w-full
                      px-4 py-3
                      rounded-xl
                      border
                      border-gray-300 dark:border-gray-600
                      text-gray-700 dark:text-gray-300
                      hover:bg-gray-100 dark:hover:bg-gray-800
                      transition-colors duration-200
                      font-medium
                    "
                  >
                    Search Another User
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}