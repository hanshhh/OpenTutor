"use client";

import { signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface ChatHeaderProps {
  username: string;
  userImage?: string | null;
}

export function ChatHeader({ username, userImage }: ChatHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-[var(--sidebar-bg)]">
      <div className="text-xl font-bold text-white">
        Quick<span className="text-blue-500">TA</span>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors p-2 rounded-md hover:bg-[#3D3D3D]"
        >
          {userImage ? (
            <Image
              src={userImage}
              alt={username}
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
              {username.charAt(0).toUpperCase()}
            </div>
          )}
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
          <div className="absolute right-0 mt-2 w-48 py-2 bg-[black] rounded-md shadow-xl border border-gray-700 z-50">
            <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
              Signed in as
              <br />
              <span className="font-medium text-white">{username}</span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/signin" })}
              className="w-full px-4 py-2 text-sm text-left text-red-500 hover:bg-[#3D3D3D] transition-colors flex items-center gap-2"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
