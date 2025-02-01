"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/chat" });
    } catch (error) {
      console.error("Sign up error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="bg-[var(--sidebar-bg)] p-8 rounded-lg shadow-lg w-full max-w-md border border-[var(--border-color)]">
        <h1 className="text-2xl font-bold text-center mb-2 text-[var(--text-primary)]">
          Create your Open<span className="text-blue-500">Tutor</span> Account
        </h1>

        <p className="text-center mb-8 text-[var(--text-secondary)] text-sm">
          Your personal AI teaching assistant
        </p>

        <button
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 px-4 py-3 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed relative border border-[var(--border-color)]"
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
              <span className="ml-2 text-gray-800">Creating account...</span>
            </>
          ) : (
            <span className="text-gray-800">Sign up with Google</span>
          )}
        </button>

        <div className="mt-8 text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-blue-500 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-500 hover:underline">
              Privacy Policy
            </Link>
          </p>

          <div className="mt-6 text-sm text-[var(--text-secondary)]">
            Already have an account?{" "}
            <Link href="/signin" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">
            Why Choose OpenTutor?
          </h2>
          <div className="grid gap-4">
            <div className="p-4 rounded-lg border border-[var(--border-color)] bg-[var(--background)]">
              <h3 className="font-medium text-[var(--text-primary)]">
                24/7 Assistance
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Get help anytime, anywhere
              </p>
            </div>
            <div className="p-4 rounded-lg border border-[var(--border-color)] bg-[var(--background)]">
              <h3 className="font-medium text-[var(--text-primary)]">
                Personalized Learning
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Adaptive to your learning style
              </p>
            </div>
            <div className="p-4 rounded-lg border border-[var(--border-color)] bg-[var(--background)]">
              <h3 className="font-medium text-[var(--text-primary)]">
                Expert Knowledge
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Specialized in all subjects
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
