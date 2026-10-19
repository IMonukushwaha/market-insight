import Response from "./Response"
import Searchbar from "./Searchbar"
import "../../Style/Mainpagecss/chatarea.css"
import { useChat } from "../../Contexts/ChatContext"

export default function Chatarea(){

    const { messages, loadingChat } = useChat();

    return <>
    <div className="chatarea-box">
        {messages.length === 0 && (
            <div className="searchbar-top">
                <Searchbar />
            </div>
        )}
        <div className="response-scroll">
            {loadingChat ? <p>Loading company insights...</p> : <Response messages={messages}/>}
        </div>
    </div>
    </>
}
