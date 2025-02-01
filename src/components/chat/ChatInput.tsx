import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
interface ChatInputProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInput({
  message,
  onMessageChange,
  onSubmit,
  isLoading,
  placeholder = "Enter your message here",
}: ChatInputProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 border-t border-gray-800 bg-[black] px-6 py-4">
      <form onSubmit={onSubmit} className="flex gap-3">
        <button
          type="button"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium disabled:opacity-50"
          disabled={isLoading}
        >
          End Conversation
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder={isLoading ? "Waiting for response..." : placeholder}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-[var(--input-bg)] text-white text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
        >
          {isLoading ? "Sending..." : "Send"}
          <PaperAirplaneIcon className="w-4 h-4 ml-2 inline-flex justify-center items-center" />
        </button>
      </form>
    </div>
  );
}
