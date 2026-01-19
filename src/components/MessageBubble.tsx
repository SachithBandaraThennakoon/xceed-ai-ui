import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage } from "../types/chat";
import { useStreamingText } from "../hooks/useStreamingText";

type Props = {
  msg: ChatMessage;
};

export default function MessageBubble({ msg }: Props) {
  const isUser = msg.role === "client";
  const isSystem = msg.role === "system";
  const isAgent = msg.role === "agent";

  const streamedContent =
    msg.role === "assistant" || msg.role === "agent"
      ? useStreamingText(msg.content)
      : msg.content;

  // -----------------------------
  // ALIGNMENT
  // -----------------------------
  let containerClass = "justify-start";
  if (isUser) containerClass = "justify-end";
  if (isSystem) containerClass = "justify-center";

  // -----------------------------
  // BASE BUBBLE STYLE (CRITICAL)
  // -----------------------------
  let bubbleClass =
    `
    max-w-[85%]
    px-4 py-3
    rounded-xl
    leading-relaxed
    text-sm
    whitespace-pre-wrap
    break-words
    overflow-wrap-anywhere
    prose prose-invert prose-sm
    prose-p:whitespace-pre-wrap
    prose-pre:overflow-x-auto
    prose-pre:whitespace-pre-wrap
    prose-code:break-all
    prose-code:whitespace-pre-wrap
  `;

  if (isUser) {
    bubbleClass += " bg-blue-600 text-white";
  } else if (isAgent) {
    bubbleClass +=
      " bg-slate-800 text-slate-200 border-l-4 border-blue-500 italic";
  } else if (isSystem) {
    bubbleClass +=
      " bg-slate-900 text-slate-400 border border-slate-700 text-center";
  } else {
    bubbleClass += " bg-slate-800 text-slate-200";
  }

  return (
    <div className={`flex w-full ${containerClass}`}>
      <div className={bubbleClass}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {streamedContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}
