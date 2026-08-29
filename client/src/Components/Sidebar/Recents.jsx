import "../../Style/sidebarcss/recents.css"
import { useChat } from "../../Contexts/ChatContext";
import { Fragment } from "react";

export default function Recents({ onNavigate }) {

    const { recentChats, chatId, selectChat, deleteChat } = useChat();

    function handleSelect(id) {
        selectChat(id);
        onNavigate?.(); // closes the mobile sidebar drawer, no-op on desktop
    }

    return (
        <div className="recents-box">
            <p className="recents-title">Recent Searches</p>
            <hr className="recents-divider" />
            {recentChats.length === 0 ? (
                <p className="recents-empty">No chats yet</p>
            ) : (
                recentChats.map((chat) => (
                    <div className="recent-chat-row" key={chat._id}>
                        <button
                            className={`recent-chat-item ${chat._id === chatId ? "active" : ""}`}
                            onClick={() => handleSelect(chat._id)}
                        >
                            {chat.title}
                        </button>
                        <button
                            className="recent-delete-item"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteChat(chat._id);
                            }}
                        >
                            Delete
                        </button>
                    </div>
                ))
            )}
        </div>
    )
}