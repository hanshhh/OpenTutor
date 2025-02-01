"use client";

import { useState } from "react";
import { Conversation } from "@prisma/client";

interface SidebarProps {
  conversations: Conversation[];
  currentConversation: string;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onUpdateConversationTitle: (id: string, newTitle: string) => void;
}

export function Sidebar({
  conversations,
  currentConversation,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  onUpdateConversationTitle,
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleEditStart = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const handleEditSave = async (id: string) => {
    if (editTitle.trim()) {
      await onUpdateConversationTitle(id, editTitle.trim());
      setEditingId(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") {
      handleEditSave(id);
    } else if (e.key === "Escape") {
      setEditingId(null);
    }
  };

  return (
    <div className="w-64 bg-[var(--sidebar-bg)] border-r border-gray-800 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-800">
        <label htmlFor="course" className="block text-xs text-gray-400 mb-1">
          Course
        </label>
        <select
          id="course"
          className="w-full bg-[var(--sidebar-bg)] border border-gray-700 rounded px-2 py-1 text-sm text-gray-200 focus:outline-none"
        >
          <option>STA238H1</option>
        </select>
      </div>

      <div className="p-3 flex items-center gap-3 border-b border-gray-800">
        <button className="p-2 rounded bg-[var(--input-bg)] hover:bg-[#3D3D3D]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <button
          onClick={onNewConversation}
          className="flex-1 bg-[#4B69FF] rounded px-3 py-2 text-xs font-medium hover:bg-[#5B79FF]"
        >
          New Conversation
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`group px-4 py-3 cursor-pointer hover:bg-gray-800 flex items-center justify-between ${
              conv.id === currentConversation ? "bg-gray-800" : ""
            }`}
          >
            {editingId === conv.id ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => handleEditSave(conv.id)}
                onKeyDown={(e) => handleKeyPress(e, conv.id)}
                className="flex-1 bg-gray-700 text-white px-2 py-1 rounded text-sm"
                autoFocus
              />
            ) : (
              <div
                onClick={() => onSelectConversation(conv.id)}
                className="flex-1 text-gray-300 hover:text-white text-sm truncate"
              >
                {conv.title}
              </div>
            )}

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditStart(conv);
                }}
                className="text-gray-400 hover:text-white"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    window.confirm(
                      "Are you sure you want to delete this conversation?"
                    )
                  ) {
                    onDeleteConversation(conv.id);
                  }
                }}
                className="text-gray-400 hover:text-red-500"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
