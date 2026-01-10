
export default function Home() {

  return (
    <main
      className="
        min-h-[calc(100vh-64px)]
        flex flex-col items-center justify-center
        px-4
        transition-colors duration-300
      "
    >
      {/* Hero Card */}
      <div
        className="
          w-full max-w-3xl
          rounded-2xl
          border
          bg-white dark:bg-gray-900
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

    
    </main>
  );
}
