import { createContext, useContext, useState, useCallback, useEffect } from "react";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [recentChats, setRecentChats] = useState([]); // [{ _id, title }]

  // Called by NewChat button — clears the active conversation.
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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/chats`, {
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/chat/${id}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        console.error('Failed to load chat', await res.text());
        return;
      }

      // selectChat — loaded history, no animation
      const data = await res.json();
      setChatId(data.chatId);
      setMessages(
        (data.messages || []).map((m) => ({
          ...m,
          chartData: m.chartData || null, // carry over stored chart data from DB
          isNew: false,
        }))
      );
    } catch (err) {
      console.error('Error loading chat:', err);
    } finally {
      setLoadingChat(false);
    }
  }, [chatId]);

  // Called by the Delete button in Recents — removes a chat from the backend
  // and from the sidebar list. If the deleted chat is the one currently open,
  // also clears the main pane back to a fresh/new-chat state.
  const deleteChat = useCallback(async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/chat/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        console.error("Failed to delete chat", await res.text());
        return;
      }

      setRecentChats((prev) => prev.filter((c) => c._id !== id));

      setChatId((currChatId) => {
        if (currChatId === id) {
          setMessages([]);
          return null;
        }
        return currChatId;
      });
    } catch (err) {
      console.error("Error deleting chat:", err);
    }
  }, []);

  // Called after a successful /getprompt response.
  // Appends the message AND upserts this chat into the recents list
  // (adds it once, with the real title, first time we see this chatId).
  const addMessage = useCallback((prompt, response, newChatId, title, chartData) => {
    setMessages((prev) => [
      ...prev,
      { prompt, response, chartData: chartData || null, isNew: true },
    ]);

    if (newChatId) {
      setChatId(newChatId);
      setRecentChats((prev) => {
        const exists = prev.some((c) => c._id === newChatId);
        if (exists) return prev;
        return [{ _id: newChatId, title: title || "New Chat" }, ...prev];
      });
    }
  }, []);

  // New: called once a message's typewriter animation finishes
  const markMessageComplete = useCallback((index) => {
    setMessages((prev) =>
      prev.map((m, i) => (i === index ? { ...m, isNew: false } : m))
    );
  }, []);

  const value = {
    chatId,
    messages,
    recentChats,
    loadingChat,
    startNewChat,
    selectChat,
    addMessage,
    deleteChat,
    setMessages,
    markMessageComplete,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within a ChatProvider");
  return ctx;
}