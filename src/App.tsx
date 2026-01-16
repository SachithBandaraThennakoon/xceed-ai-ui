import { useState } from "react";
import StatusBar from "./components/StatusBar";
import ChatArea from "./components/ChatArea";
import { sendMessage, generateProposal } from "./services/api";
import type { ChatMessage } from "./types/chat";
import EmailBox from "./components/EmailBox";

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

  // -----------------------------
  // SEND MESSAGE
  // -----------------------------
  async function handleSend() {
    if (!input.trim() || showEmailBox) return;

    const userMsg = input;
    setInput("");

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

      if (res.confirmed) {
        setStep(1);
      }
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
  // GENERATE PROPOSAL
  // -----------------------------
  async function handleGenerateProposal() {
    if (!sessionId) return;

    setStep(2);

    setMessages(prev => [
      ...prev,
      {
        role: "system",
        content:
          "Discovery confirmed. Our experts are now working on your solution…"
      },
      {
        role: "agent",
        content:
          "🧠 **BA Agent**: Analyzing business requirements and objectives…"
      }
    ]);

    await new Promise(r => setTimeout(r, 1200));

    setMessages(prev => [
      ...prev,
      {
        role: "agent",
        content:
          "🏗 **Solution Architect**: Designing scalable AI, data & BI architecture…"
      }
    ]);

    await new Promise(r => setTimeout(r, 1200));

    setMessages(prev => [
      ...prev,
      {
        role: "agent",
        content:
          "📄 **Proposal Agent**: Preparing a client-ready proposal document…"
      }
    ]);

    await new Promise(r => setTimeout(r, 1500));

    const res = await generateProposal(sessionId);

    setMessages(prev => [
      ...prev,
      {
        role: "assistant",
        content: res.final_proposal
      },
      {
        role: "system",
        content:
          "Would you like us to send this proposal to your email?"
      }
    ]);

    setStep(3);
    setShowEmailBox(true);
  }

  // -----------------------------
  // RESTART
  // -----------------------------
  function handleRestart() {
    setMessages([]);
    setInput("");
    setSessionId(undefined);
    setShowEmailBox(false);
    setStep(0);
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="flex h-screen bg-slate-900 text-slate-100">
      <div className="flex flex-col flex-1 relative">

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto flex justify-center px-4">
          <div className="w-full max-w-4xl py-6 space-y-4">
            <ChatArea messages={messages} />
          </div>
        </div>

        {/* STATUS BAR */}
        <StatusBar step={step} />

        {/* INPUT BAR */}
        {!showEmailBox && (
          <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800">
            <div className="max-w-4xl mx-auto p-4 flex gap-2">
              <textarea
                className="flex-1 resize-none rounded-lg bg-slate-800 text-white px-3 py-2 text-sm outline-none"
                rows={1}
                value={input}
                placeholder="Message Xceed AI…"
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />

              <button
                onClick={handleSend}
                className="bg-blue-600 hover:bg-blue-500 px-4 rounded-lg"
              >
                Send
              </button>

              {step === 1 && (
                <button
                  onClick={handleGenerateProposal}
                  className="bg-green-600 hover:bg-green-500 px-4 rounded-lg"
                >
                  Generate Proposal
                </button>
              )}
            </div>
          </div>
        )}

        {/* EMAIL BOX */}
        {showEmailBox && (
          <EmailBox
            onSend={email => {
              setMessages(prev => [
                ...prev,
                {
                  role: "system",
                  content: `📨 Proposal will be sent to **${email}**`
                }
              ]);

              setShowEmailBox(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
