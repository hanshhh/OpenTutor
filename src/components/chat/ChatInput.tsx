"use client";

import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

interface ChatInputProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function ChatInput({
  message,
  onMessageChange,
  onSubmit,
  isLoading,
  placeholder = "Type your message...",
}: ChatInputProps) {
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (message.trim() && !isLoading) {
      onSubmit();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-4 border-t border-[var(--border-color)] bg-[var(--sidebar-bg)]">
      <div className="flex gap-4 max-w-5xl mx-auto">
        <button
          onClick={() => {
            if (
              window.confirm("Are you sure you want to end this conversation?")
            ) {
              // Handle end conversation
            }
          }}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          End Conversation
        </button>

        <form
          onSubmit={(e) => handleSubmit(e)}
          className="flex-1 flex items-center gap-2"
        >
          <textarea
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            rows={1}
            className="flex-1 resize-none bg-[var(--input-bg)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-[var(--border-color)]"
            style={{
              minHeight: "44px",
              maxHeight: "200px",
            }}
          />

          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Send
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
