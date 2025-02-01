"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/chat" });
    } catch (error) {
      console.error("Sign in error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="bg-[var(--sidebar-bg)] p-8 rounded-lg shadow-lg w-full max-w-md border border-[var(--border-color)]">
        <h1 className="text-2xl font-bold text-center mb-8 text-[var(--text-primary)]">
          Welcome to Open<span className="text-blue-500">Tutor</span>
        </h1>

        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 px-4 py-3 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed relative border border-[var(--border-color)] hover:cursor-pointer"
        >
          {!isLoading && (
            <Image
              src="/google.svg"
              alt="Google"
              width={20}
              height={20}
              className="w-5 h-5"
            />
          )}

          {isLoading ? (
            <>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 bg-gray-800 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-800 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-800 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
              <span className="ml-2 text-gray-800">Signing in...</span>
            </>
          ) : (
            <span className="text-gray-800">Sign in with Google</span>
          )}
        </button>

        <div className="mt-8 text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            Your personal teaching assistant for statistics
          </p>
          <p className="mt-2 text-xs text-[var(--text-secondary)]">
            Sign in to start learning
          </p>
        </div>
      </div>
    </div>
  );
}
