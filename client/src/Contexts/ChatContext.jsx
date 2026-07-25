import { createContext, useContext, useState, useCallback, useEffect } from "react";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [recentChats, setRecentChats] = useState([]); // [{ _id, title }]

  // Called by NewChat button — clears the active conversation.
  // No entry is added to recentChats yet; that happens once the
  // first message actually creates a chat on the backend (see addMessage).
  const startNewChat = useCallback(() => {
    setChatId(null);
    setMessages([]);
  }, []);

  const [loadingChat, setLoadingChat] = useState(false);

  // On first mount (page load / refresh), pull the user's existing chats
  // from the backend so the sidebar survives reloads instead of resetting.
  useEffect(() => {
    async function loadRecentChats() {
      try {
        const res = await fetch("http://localhost:5000/chats", {
          credentials: "include",
        });
        if (!res.ok) return; // e.g. 401 if not logged in yet — fail quietly here
        const data = await res.json();
        setRecentChats(
          data.chats.map((c) => ({ _id: c._id, title: c.title }))
        );
      } catch (err) {
        console.error("Error loading recent chats:", err);
      }
    }
    loadRecentChats();
  }, []);

  // Called by Recents list items — switches the main pane to a past chat
  // AND fetches that chat's message history from the backend.
  const selectChat = useCallback(async (id) => {
    if (id === chatId) return; // already viewing this chat
    setLoadingChat(true);
    try {
      const res = await fetch(`http://localhost:5000/chat/${id}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        console.error('Failed to load chat', await res.text());
        return;
      }

      const data = await res.json();
      setChatId(data.chatId);
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Error loading chat:', err);
    } finally {
      setLoadingChat(false);
    }
  }, [chatId]);

  // Called after a successful /getprompt response.
  // Appends the message AND upserts this chat into the recents list
  // (adds it once, with the real title, first time we see this chatId).
  const addMessage = useCallback((prompt, response, type, newChatId, title) => {
    setMessages((prev) => [...prev, { prompt, response, type }]);

    if (newChatId) {
      setChatId(newChatId);
      setRecentChats((prev) => {
        const exists = prev.some((c) => c._id === newChatId);
        if (exists) return prev;
        return [{ _id: newChatId, title: title || "New Chat" }, ...prev];
      });
    }
  }, []);

  const value = {
    chatId,
    messages,
    recentChats,
    loadingChat,
    startNewChat,
    selectChat,
    addMessage,
    setMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within a ChatProvider");
  return ctx;
}