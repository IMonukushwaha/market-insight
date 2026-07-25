import "../../Style/Mainpagecss/response.css"
import ChatResponse from "./ChatResponse";

export default function Response({ messages }) {
  return (
    <div className="response_container">
      {messages.map((msg, index) => (
        <div key={index}>
          <p className="prompt">{msg.prompt}</p>
          <ChatResponse content={msg.response} />
        </div>
      ))}
    </div>
  );
}