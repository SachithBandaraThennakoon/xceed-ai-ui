import { useEffect, useState } from "react";

type AgentPanelProps = {
  title: string;
  content: string;
  progress: number; // 0–100
};

export default function AgentPanel({
  title,
  content,
  progress,
}: AgentPanelProps) {
  const [typedText, setTypedText] = useState<string>("");

  // -----------------------------
  // TYPEWRITER EFFECT
  // -----------------------------
  useEffect(() => {
    let index = 0;
    setTypedText("");

    const interval = setInterval(() => {
      setTypedText((prev) => prev + content.charAt(index));
      index++;

      if (index >= content.length) {
        clearInterval(interval);
      }
    }, 20); // typing speed

    return () => clearInterval(interval);
  }, [content]);

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-4 shadow-sm">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-blue-400">
          {title} — Working
        </span>
        <span className="text-xs text-slate-400">
          {progress}%
        </span>
      </div>

      {/* PROGRESS BAR */}
      <div className="w-full h-1 bg-slate-700 rounded overflow-hidden mb-3">
        <div
          className="h-1 bg-blue-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* CONTENT (TYPING) */}
      <div className="text-sm text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
        {typedText}
        <span className="animate-pulse">▍</span>
      </div>
    </div>
  );
}
