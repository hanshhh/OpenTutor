"use client";

import { signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";

interface ChatHeaderProps {
  username: string;
  userImage?: string | null;
}

export function ChatHeader({ username, userImage }: ChatHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleThemeToggle = () => {
    setIsSpinning(true);
    toggleTheme();
    // Reset spinning after animation completes
    setTimeout(() => setIsSpinning(false), 500);
  };

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
    <header className="flex items-center justify-between px-6 py-3 border-b border-[var(--border-color)] bg-[var(--sidebar-bg)]">
      <div className="text-xl font-bold text-[var(--text-primary)]">
        Open<span className="text-blue-500">Tutor</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleThemeToggle}
          className="p-2 rounded-md hover:bg-[var(--hover-bg)] transition-colors text-[var(--text-primary)]"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <div
            className={`transform ${
              isSpinning ? "animate-spin" : ""
            } transition-transform duration-500`}
          >
            {theme === "dark" ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
              </svg>
            )}
          </div>
        </button>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 text-sm text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors p-2 rounded-md"
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
            <div className="absolute right-0 mt-2 w-48 py-2 bg-[var(--dropdown-bg)] rounded-md shadow-lg border border-[var(--dropdown-border)] z-50">
              <div className="px-4 py-2 text-sm text-[var(--text-secondary)] border-b border-[var(--dropdown-border)]">
                Signed in as
                <br />
                <span className="font-medium text-[var(--text-primary)]">
                  {username}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/signin" })}
                className="w-full px-4 py-2 text-sm text-left text-red-500 hover:bg-[var(--dropdown-hover)] transition-colors flex items-center gap-2"
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
      </div>
    </header>
  );
}
