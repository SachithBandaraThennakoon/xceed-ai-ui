import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import AgentPanel from "./components/AgentPanel";
import MarkdownViewer from "./components/MarkdownViewer";
import { sendMessage, generateProposal } from "./services/api";
import type { ChatMessage } from "./types/chat";

export default function App() {
  // -----------------------------
  // STATE (STRONGLY TYPED)
  // -----------------------------
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");

  const [sessionId, setSessionId] = useState<string | undefined>(undefined);

  const [step, setStep] = useState<number>(0);
  // 0 = discovery
  // 1 = confirmed
  // 2 = agents working
  // 3 = proposal ready

  const [loadingAgents, setLoadingAgents] = useState<boolean>(false);
  const [proposal, setProposal] = useState<string | null>(null);

  // -----------------------------
  // SEND CHAT MESSAGE
  // -----------------------------
  async function handleSend() {
    if (!input.trim() || loadingAgents || proposal) return;

    const userMsg = input;
    setInput("");

    setMessages((prev) => [
      ...prev,
      { role: "client", content: userMsg },
    ]);

    try {
      const res = await sendMessage(userMsg, sessionId);

      setSessionId(res.session_id);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.reply },
      ]);

      if (res.confirmed) {
        setStep(1); // confirmed
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Backend error. Please try again.",
        },
      ]);
    }
  }

  // -----------------------------
  // GENERATE PROPOSAL
  // -----------------------------
  async function handleGenerateProposal() {
  if (!sessionId) return;

  setStep(2);

  // SYSTEM MESSAGE
  setMessages(prev => [
    ...prev,
    {
      role: "system",
      content: "Discovery confirmed. Our experts are now working on your solution…"
    }
  ]);

  // AGENT 1
  setMessages(prev => [
    ...prev,
    {
      role: "agent",
      content: "🧠 **BA Agent**: Analyzing business requirements and objectives…"
    }
  ]);

  await new Promise(r => setTimeout(r, 1200));

  // AGENT 2
  setMessages(prev => [
    ...prev,
    {
      role: "agent",
      content: "🏗 **Solution Architect**: Designing scalable AI, data & BI architecture…"
    }
  ]);

  await new Promise(r => setTimeout(r, 1200));

  // AGENT 3
  setMessages(prev => [
    ...prev,
    {
      role: "agent",
      content: "📄 **Proposal Agent**: Preparing a client-ready proposal document…"
    }
  ]);

  await new Promise(r => setTimeout(r, 1500));

  // CALL BACKEND
  const res = await generateProposal(sessionId);

  // FINAL PROPOSAL AS CHAT MESSAGE (MARKDOWN)
  setMessages(prev => [
    ...prev,
    {
      role: "assistant",
      content: res.final_proposal
    }
  ]);

  setStep(3);
}


  // -----------------------------
  // RESTART FLOW
  // -----------------------------
  function handleRestart() {
    setMessages([]);
    setInput("");
    setSessionId(undefined);
    setProposal(null);
    setLoadingAgents(false);
    setStep(0);
  }


  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="flex h-screen bg-slate-900 text-slate-100">
      {/* SIDEBAR */}
      <Sidebar step={step} />

      {/* MAIN */}
      <div className="flex flex-col flex-1 relative">

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto flex justify-center px-4">
          <div className="w-full max-w-4xl py-6 space-y-6">

            {/* CHAT */}
            {!proposal && <ChatArea messages={messages} />}

            {/* AGENTS */}
            


            {/* PROPOSAL */}
            {proposal && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-4">
                  📄 Final Proposal
                </h2>

                <MarkdownViewer content={proposal} />

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleRestart}
                    className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg"
                  >
                    Restart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* INPUT BAR */}
        {!proposal && (
          <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800">
            <div className="max-w-4xl mx-auto p-4 flex gap-2">
              <textarea
                className="flex-1 resize-none rounded-lg bg-slate-800 text-white px-3 py-2 text-sm outline-none"
                rows={1}
                value={input}
                placeholder={
                  loadingAgents
                    ? "Agents are working…"
                    : "Message Xceed AI…"
                }
                disabled={loadingAgents}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />

              <button
                onClick={handleSend}
                disabled={loadingAgents}
                className="bg-blue-600 hover:bg-blue-500 px-4 rounded-lg disabled:opacity-50"
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
      </div>
    </div>
  );
}


