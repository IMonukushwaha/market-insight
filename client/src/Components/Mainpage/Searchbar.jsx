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

    function handleKeyDown(event){
        if(event.key === "Enter"){
            handleSend();
        }
    }

    async function handleSend(){
        if(!prompt.trim()){
            return;
        }
        setloading(true);
        try{
            const res = await fetch(`http://localhost:5000/prompt`, {
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

            // pushes message into chat, now including chartData for rendering the chart
            addMessage(prompt, data.response, data.chatId, data.title, data.chartData);

            setPrompt("");

        }catch(err){
            console.log(err);
        }finally{
            setloading(false);
        }
    }

    return (
        <div className="search-wrapper">
            <div className="search-box">
                <div className="search-icon-wrap">
                    <svg className="search-icon" viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"/>
                    </svg>
                </div>
                <input
                    placeholder="Enter a company name for market insight..."
                    value={prompt}
                    type="text"
                    onChange={handleOnChange}
                    onKeyDown={handleKeyDown}
                    className="search-input"
                    disabled={loading}
                />
                {loading && <span className="search-loading">Searching</span>}
            </div>
        </div>
    )
}