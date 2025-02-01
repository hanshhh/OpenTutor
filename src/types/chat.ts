export interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: "user" | "assistant";
}

export interface Conversation {
  id: string;
  messages: Message[];
  title: string;
}
