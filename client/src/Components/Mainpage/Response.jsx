import "../../Style/Mainpagecss/response.css"
import ChatResponse from "./ChatResponse";
import { useChat } from "../../Contexts/ChatContext";

export default function Response({ messages }) {
  const { markMessageComplete } = useChat();

  return (
    <div className="response_container">
      {messages.map((msg, index) => (
        <div key={index} className="message_pair">
          <p className="prompt">{msg.prompt}</p>
          <ChatResponse
            content={msg.response}
            animate={msg.isNew}
            chartData={msg.chartData}
            onComplete={() => markMessageComplete(index)}
          />
        </div>
      ))}
    </div>
  );
}