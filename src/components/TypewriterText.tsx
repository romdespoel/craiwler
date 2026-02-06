import { useState, useEffect, useCallback, useRef } from "react";

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
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

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
        onCompleteRef.current?.();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  const skip = useCallback(() => {
    setDisplayed(text);
    setDone(true);
    onCompleteRef.current?.();
  }, [text]);

  return (
    <span className={className} onClick={skip} style={{ cursor: done ? "default" : "pointer" }}>
      {displayed}
      {!done && <span className="cursor-blink" style={{ color: "#ffffff" }}>█</span>}
    </span>
  );
}
