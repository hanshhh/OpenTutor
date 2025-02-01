"use client";

import { useState, useEffect, useRef } from "react";

interface ChatMessagesProps {
  messages: Message[];
  streamingMessage?: string;
  isLoading?: boolean;
}

export function ChatMessages({
  messages,
  streamingMessage,
  isLoading,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="px-6 py-4 space-y-4">
        {messages.map((msg) => {
          const isAssistant = msg.sender === "assistant";
          return (
            <div
              key={msg.id}
              className={`flex ${
                isAssistant ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  isAssistant
                    ? "bg-gray-700 text-white"
                    : "bg-blue-600 text-white"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">
                  {msg.content}
                </p>
              </div>
            </div>
          );
        })}

        {streamingMessage && (
          <div className="flex justify-start">
            <div className="rounded-lg px-4 py-2 max-w-[80%] bg-gray-700 text-white">
              <p className="text-sm whitespace-pre-wrap break-words">
                {streamingMessage}
                <span className="inline-block ml-1 animate-pulse">▊</span>
              </p>
            </div>
          </div>
        )}

        {isLoading && !streamingMessage && (
          <div className="flex justify-start">
            <div className="rounded-lg px-4 py-2 max-w-[80%] bg-gray-700 text-white">
              <div className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
