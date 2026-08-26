import ReactMarkdown from "react-markdown";
import "../../Style/Mainpagecss/chatresponse.css";
import useTypewriter from "../Hooks/TypeWriter";
import { useEffect } from "react";
import ChartsPanel from "./Chartpanel";

export default function ChatResponse({ content, animate, onComplete, chartData }) {
  const { text: typedText, done } = useTypewriter(animate ? content : content, 5, animate);
  const displayText = animate ? typedText : content;

  useEffect(() => {
    if (animate && done) {
      onComplete?.();
    }
  }, [animate, done]);

  return (
    <div className="chat-response">
      <ReactMarkdown>{displayText}</ReactMarkdown>
      {/* Wait until typewriter finishes so charts don't pop in mid-animation */}
      {(!animate || done) && <ChartsPanel chartData={chartData} />}
    </div>
  );
}