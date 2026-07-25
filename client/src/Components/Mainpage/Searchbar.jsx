import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useChat } from "../../Contexts/ChatContext"
import "../../Style/Mainpagecss/searchbar.css"

export default function Searchbar(){

    let [prompt, setPrompt] = useState("");
    let [loading, setloading] = useState(false);
    const navigate = useNavigate();
    const { chatId, addMessage } = useChat();

    function handleOnChange(event){
        setPrompt(event.target.value);
    }

    async function handleSend(){
        if(!prompt.trim()){
            return;
        }
        setloading(true);
        try{
            const res = await fetch(`http://localhost:5000/getprompt`, {
                method : 'POST',
                headers : { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({ prompt, chatId }),
            })

            if(res.status === 401){
                navigate("/login");
                return;
            }

            if(!res.ok){
                throw new Error("Failed to send message");
            }

            const data = await res.json();
            console.log('API response:', data);

            // pushes message into chat
            addMessage(prompt, data.response, data.type, data.chatId, data.title);

            setPrompt("");

        }catch(err){
            console.log(err);
        }finally{
            setloading(false);
        }
    }

    return <>
    <div className="search_container">
        <div className="searchbar-box">
            <input
            placeholder="Write a message..."
            value={prompt}
            type="text"
            onChange={handleOnChange}
            className="searchbar-input"
            ></input>
        <div className="btndiv">
            <button className="searchbar-send-btn" onClick={handleSend} disabled={loading}>
                {loading ? "Sending..." : "Send"}
            </button>
        </div>
        </div>
    </div>
    </>
}