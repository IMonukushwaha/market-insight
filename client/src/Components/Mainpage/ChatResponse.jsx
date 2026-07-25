import ReactMarkdown from "react-markdown";
import "../../Style/Mainpagecss/chatresponse.css";

export default function ChatResponse({ content }) {
  return (
    <div className="chat-response">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}