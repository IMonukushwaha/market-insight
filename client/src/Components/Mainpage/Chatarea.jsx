import Response from "./Response"
import Searchbar from "./Searchbar"
import "../../Style/Mainpagecss/chatarea.css"
import { useChat } from "../../Contexts/ChatContext"

export default function Chatarea(){

    const { messages, loadingChat } = useChat();

    return <>
    <div className="chatarea-box">
        <div className="response-scroll">
            {loadingChat ? <p>Loading chat...</p> : <Response messages={messages}/>}
        </div>
        <div className="searchbar-fixed">
            <Searchbar/>
        </div>
    </div>
    </>
}