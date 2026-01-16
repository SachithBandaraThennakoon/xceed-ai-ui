import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage } from "../types/chat";

type Props = {
  msg: ChatMessage;
};

export default function MessageBubble({ msg }: Props) {
  const isUser = msg.role === "client";
  const isSystem = msg.role === "system";
  const isAgent = msg.role === "agent";

  // -----------------------------
  // ALIGNMENT
  // -----------------------------
  let containerClass = "justify-start";
  if (isUser) containerClass = "justify-end";
  if (isSystem) containerClass = "justify-center";

  // -----------------------------
  // STYLING
  // -----------------------------
  let bubbleClass =
    "prose prose-invert prose-sm max-w-2xl px-4 py-3 rounded-xl leading-relaxed";

  if (isUser) {
    bubbleClass += " bg-blue-600 text-white";
  } else if (isAgent) {
    bubbleClass +=
      " bg-slate-800 text-slate-200 border-l-4 border-blue-500";
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
          {msg.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
