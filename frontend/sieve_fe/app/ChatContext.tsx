// In a new file, e.g., ChatProvider.jsx
import { createContext, useContext, useState } from "react";

interface ChatContextType {
  chatId: string;
  setChatId: (id: string) => void;
}

// Create the context with an initial value of `undefined` (to ensure proper typing)
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Hook to use the context
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chatId, setChatId] = useState("");

  return (
    <ChatContext.Provider value={{ chatId, setChatId }}>
      {children}
    </ChatContext.Provider>
  );
}
