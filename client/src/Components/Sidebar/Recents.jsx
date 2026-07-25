import "../../Style/sidebarcss/recents.css"
import { useChat } from "../../Contexts/ChatContext";

export default function Recents(){

    const { recentChats, chatId, selectChat } = useChat();
    
    return (
        <div className="recents-box">
            <p className="recents-title">Recent chats</p>
            <hr className="recents-divider" />
            {recentChats.length === 0 ? (
                <p className="recents-empty">No chats yet</p>
            ) : (
                recentChats.map((chat) => (
                    <button
                        key={chat._id}
                        className={`recent-chat-item ${chat._id === chatId ? "active" : ""}`}
                        onClick={() => selectChat(chat._id)}
                    >
                        {chat.title}
                    </button>
                ))
            )}
        </div>
    )
}