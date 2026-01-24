import { useEffect, useState } from "react";

export function useStreamingText(fullText: string, speed = 13) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!fullText) {
      setText("");
      return;
    }

    let i = 0;
    let current = "";
    setText(""); // reset safely

    const interval = setInterval(() => {
      current += fullText[i];
      setText(current);
      i++;

      if (i >= fullText.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [fullText, speed]);

  return text;
}
