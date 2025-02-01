"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

interface ChatHeaderProps {
  username: string;
}

export function ChatHeader({ username }: ChatHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-[var(--sidebar-bg)]">
      <div className="text-xl font-bold text-white">
        Open<span className="text-blue-500">TA</span>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
        >
          <span>{username}</span>
          <svg
            className={`w-4 h-4 transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 py-2 bg-[white] rounded-md shadow-xl border border-gray-700 z-50">
            <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
              Signed in as
              <br />
              <span className="font-medium text-black">{username}</span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/signin" })}
              className="w-full px-4 py-2 text-sm text-left text-red-500 hover:bg-gray-800 transition-colors hover:cursor-pointer"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
