"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { Sidebar } from "@/components/chat/Sidebar";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import type { Message, Conversation } from "@/types/chat";

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const [streamingMessage, setStreamingMessage] = useState<string>("");

  useEffect(() => {
    if (session?.user) {
      fetchConversations();
    }
  }, [session]);

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/conversations");
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
        if (data.length > 0 && !currentConversation) {
          setCurrentConversation(data[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  };

  const handleNewConversation = () => {
    setCurrentConversation(null);
    setMessage("");
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    setStreamingMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          conversationId: currentConversation,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      let accumulatedMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert the chunk to text
        const text = new TextDecoder().decode(value);
        const lines = text.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "stream") {
                accumulatedMessage += data.content;
                setStreamingMessage(accumulatedMessage);
              } else if (data.type === "end") {
                // Update conversations with the complete message
                if (data.conversation) {
                  setConversations((prev) => [...prev, data.conversation]);
                  setCurrentConversation(data.conversation.id);
                } else {
                  setConversations((prev) =>
                    prev.map((conv) =>
                      conv.id === currentConversation
                        ? {
                            ...conv,
                            messages: [...conv.messages, ...data.messages],
                          }
                        : conv
                    )
                  );
                }
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }

      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
      setStreamingMessage("");
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setConversations((prev) => prev.filter((conv) => conv.id !== id));
        if (currentConversation === id) {
          setCurrentConversation(null);
        }
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  const handleUpdateConversationTitle = async (
    id: string,
    newTitle: string
  ) => {
    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle }),
      });

      if (response.ok) {
        const updatedConversation = await response.json();
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === id
              ? { ...conv, title: updatedConversation.title }
              : conv
          )
        );
      }
    } catch (error) {
      console.error("Failed to update conversation title:", error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in to access the chat.</div>;
  }

  const currentConv = conversations.find((c) => c.id === currentConversation);

  return (
    <div className="flex flex-col h-screen bg-[var(--background)]">
      <ChatHeader username={session.user.name || "Anonymous"} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          conversations={conversations}
          currentConversation={currentConversation || ""}
          onNewConversation={handleNewConversation}
          onSelectConversation={setCurrentConversation}
          onDeleteConversation={handleDeleteConversation}
          onUpdateConversationTitle={handleUpdateConversationTitle}
        />
        <div className="flex-1 flex flex-col relative bg-[var(--chat-bg)]">
          {currentConv && (
            <ChatMessages
              messages={currentConv.messages}
              streamingMessage={streamingMessage}
              isLoading={isLoading && !streamingMessage}
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--chat-bg)] to-transparent h-8" />
          <ChatInput
            message={message}
            onMessageChange={setMessage}
            onSubmit={handleSendMessage}
            isLoading={isLoading}
            placeholder={
              currentConversation
                ? "Type your message..."
                : "Start a new conversation..."
            }
          />
        </div>
      </div>
    </div>
  );
}
