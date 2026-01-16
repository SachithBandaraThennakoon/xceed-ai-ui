import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import type{ ChatMessage } from "../types/chat";

export default function ChatArea({ messages }: { messages: ChatMessage[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Scroll when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Scroll while content height changes (typing animation)
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col space-y-4"
    >
      {messages.map((m, i) => (
        <MessageBubble key={i} msg={m} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
