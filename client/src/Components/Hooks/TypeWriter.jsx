import { useState, useEffect } from "react";

export default function useTypewriter(text, speed = 2, active = true) {
  const [displayed, setDisplayed] = useState(active ? "" : text);
  const [done, setDone] = useState(!active);

  useEffect(() => {
    if (!active) {
      setDisplayed(text);
      setDone(true);
      return;
    }

    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, active]);

  return { text: displayed, done };
}