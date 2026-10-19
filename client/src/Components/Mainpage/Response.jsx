import "../../Style/Mainpagecss/response.css"
import ChatResponse from "./ChatResponse";
import { useChat } from "../../Contexts/ChatContext";

export default function Response({ messages }) {
  const { markMessageComplete } = useChat();

  return (
    <div className="response_container">
      {messages.map((msg, index) => (
        <div key={index} className="message_pair">
          <div className="response-company-heading">
            <span>Company market insight</span>
            <h1>{msg.chartData?.companyInfo?.name || msg.chartData?.ticker || "Company not found"}</h1>
            {msg.chartData?.ticker && msg.chartData?.companyInfo?.name && (
              <small>{msg.chartData.ticker}</small>
            )}
          </div>
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
