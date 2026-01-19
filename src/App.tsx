import { useEffect, useRef, useState } from "react";
import StatusBar from "./components/StatusBar";
import ChatArea from "./components/ChatArea";
import EmailBox from "./components/EmailBox";
import AgentProgress from "./components/AgentProgress";
import { sendMessage, generateProposal } from "./services/api";
import type { ChatMessage } from "./types/chat";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function App() {
  // -----------------------------
  // STATE
  // -----------------------------
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | undefined>();

  const [step, setStep] = useState(0);
  // 0 discovery | 1 confirmed | 2 agents | 3 proposal

  const [showEmailBox, setShowEmailBox] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const disableSend = isGenerating || step >= 2;


  // -----------------------------
  // INITIAL GREETING
  // -----------------------------
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: "👋 Hi! I’m **Xceed AI**. How can I help you today?"
      }
    ]);
  }, []);

  // -----------------------------
  // AUTO SCROLL
  // -----------------------------
  useEffect(() => {
    const el = document.getElementById("chat-scroll");
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  // -----------------------------
  // SEND MESSAGE
  // -----------------------------
  async function handleSend() {
     if (!input.trim() || showEmailBox || disableSend) return;

    const userMsg = input;
    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setMessages(prev => [
      ...prev,
      { role: "client", content: userMsg }
    ]);

    try {
      const res = await sendMessage(userMsg, sessionId);
      setSessionId(res.session_id);

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: res.reply }
      ]);

      if (res.confirmed) setStep(1);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Backend error. Please try again."
        }
      ]);
    }
  }

  // -----------------------------
  // TYPING ANIMATION
  // -----------------------------
  async function typeMessage(
    role: ChatMessage["role"],
    fullText: string,
    speed = 15
  ) {
    let current = "";
    setMessages(prev => [...prev, { role, content: "" }]);

    for (let i = 0; i < fullText.length; i++) {
      current += fullText[i];
      setMessages(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = { role, content: current };
        return copy;
      });
      await new Promise(r => setTimeout(r, speed));
    }
  }

  async function addAgentMessage(text: string) {
    setIsTyping(true);
    await typeMessage("agent", text);
    setIsTyping(false);
  }

  // -----------------------------
  // GENERATE PROPOSAL
  // -----------------------------
  async function handleGenerateProposal() {
    if (!sessionId) return;

    setIsGenerating(true);
    setStep(2);

    setMessages(prev => [
      ...prev,
      {
        role: "system",
        content:
          "✅ Discovery confirmed. Our experts are now working on your solution…"
      }
    ]);

    await addAgentMessage(
      "🧠 BA Agent: Analyzing business requirements and objectives…"
    );
    await addAgentMessage(
      "🏗 Solution Architect: Designing scalable AI, data & BI architecture…"
    );
    await addAgentMessage(
      "📄 Proposal Agent: Preparing a client-ready proposal document…"
    );

    const res = await generateProposal(sessionId);

    setMessages(prev => [
      ...prev,
      { role: "assistant", content: res.final_proposal },
      {
        role: "system",
        content: "📧 Would you like us to send this proposal to your email?"
      }
    ]);

    setStep(3);
    setShowEmailBox(true);
    setIsGenerating(false);
  }

  // -----------------------------
  // RESET FLOW
  // -----------------------------
  function resetChat() {
    setMessages([
      {
        role: "assistant",
        content: "👋 Hi! I’m **Xceed AI**. How can I help you today?"
      }
    ]);
    setSessionId(undefined);
    setStep(0);
    setShowEmailBox(false);
    setIsGenerating(false);
    setIsTyping(false);
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="h-[85vh] bg-slate-900 text-slate-100 flex items-center justify-center">

      <div className="w-full max-w-4xl h-[75vh] flex flex-col border border-slate-800 rounded-xl bg-slate-900 shadow-xl">

        {/* STATUS */}
        <div className="shrink-0 border-b border-slate-800 px-4 py-2 space-y-2">
          <StatusBar step={step} />
          {step >= 2 && <AgentProgress step={step} />}
        </div>

        {/* CHAT */}
        <div
          id="chat-scroll"
          className="flex-1 overflow-y-auto overscroll-contain px-4 py-4"
        >
          <ChatArea messages={messages} />

          {isTyping && (
            <div className="text-sm text-slate-400 italic animate-pulse mt-2">
              🤖 Agent is working…
            </div>
          )}
        </div>

        {/* INPUT / EMAIL */}
        {!showEmailBox ? (
          <div className="shrink-0 border-t border-slate-800 px-4 py-3">
            <div className="flex items-end gap-2">

              <textarea
                ref={textareaRef}
                className="flex-1 resize-none rounded-lg bg-slate-800 text-white px-3 py-2 text-sm outline-none max-h-32 overflow-y-auto"
                rows={1}
                value={input}
                placeholder="Message Xceed AI…"
                inputMode="text"
                enterKeyHint="send"
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />

              <button
  onClick={handleSend}
  disabled={disableSend}
  className="h-10 w-10 flex items-center justify-center rounded-lg
             bg-blue-600 hover:bg-blue-500
             disabled:opacity-40 disabled:cursor-not-allowed"
>
  ➤
</button>



              {step === 1 && (
                <button
                  onClick={handleGenerateProposal}
                  disabled={isGenerating}
                  className="h-10 px-4 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-50"
                >
                  Generate
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="shrink-0 border-t border-slate-800">
            <EmailBox
              onSend={async (email) => {
                await fetch(`${API_BASE}/send-proposal-email`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    session_id: sessionId,
                    email
                  })
                });

                setMessages(prev => [
                  ...prev,
                  {
                    role: "system",
                    content: `✅ Proposal successfully sent to **${email}**`
                  },
                  {
                    role: "system",
                    content: "🎉 Thank you! This conversation is now complete."
                  }
                ]);

                setTimeout(resetChat, 3000);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
