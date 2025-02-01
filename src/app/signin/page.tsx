"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212]">
      <div className="bg-[#1E1E1E] p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Welcome to Open<span className="text-blue-500">TA</span>
          </h1>
          <p className="text-gray-400">Sign in to continue to your account</p>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/chat" })}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Image src="/google.svg" alt="Google" width={20} height={20} />
          <span className="font-medium">Sign in with Google</span>
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
