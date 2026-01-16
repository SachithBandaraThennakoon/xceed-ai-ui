import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import type { ChatMessage } from "../types/chat";

export default function ChatArea({ messages }: { messages: ChatMessage[] }) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col space-y-4">
      {messages.map((m, i) => (
        <MessageBubble key={i} msg={m} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
