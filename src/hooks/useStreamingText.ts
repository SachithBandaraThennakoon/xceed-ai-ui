import { useEffect, useState } from "react";

export function useStreamingText(
  fullText: string,
  speed = 15
) {
  const [text, setText] = useState("");

  useEffect(() => {
    let i = 0;
    setText("");

    const interval = setInterval(() => {
      setText((prev) => prev + fullText.charAt(i));
      i++;

      if (i >= fullText.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [fullText]);

  return text;
}
