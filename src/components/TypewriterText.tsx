import { useState, useEffect, useCallback } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

export default function TypewriterText({
  text,
  speed = 22,
  onComplete,
  className = "",
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, onComplete]);

  const skip = useCallback(() => {
    setDisplayed(text);
    setDone(true);
    onComplete?.();
  }, [text, onComplete]);

  return (
    <span className={className} onClick={skip} style={{ cursor: done ? "default" : "pointer" }}>
      {displayed}
      {!done && <span className="cursor-blink" style={{ color: "#ffffff" }}>█</span>}
    </span>
  );
}
