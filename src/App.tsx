import { useEffect, useRef, useState } from "react";
import StatusBar from "./components/StatusBar";
import ChatArea from "./components/ChatArea";
import EmailBox from "./components/EmailBox";
import AgentProgress from "./components/AgentProgress";
import AgentThinking from "./components/AgentThinking";
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

  // 0 discovery | 1 confirmed | 2 working | 3 proposal | 4 emailed
  const [step, setStep] = useState(0);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [showEmailBox, setShowEmailBox] = useState(false);
  const [awaitingEmailConfirm, setAwaitingEmailConfirm] = useState(false);
  //const [emailToConfirm, setEmailToConfirm] = useState<string | null>(null);

  const [activeAgent, setActiveAgent] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const didFetchGreeting = useRef(false);

  const disableSend =
    isGenerating || step === 1 || step === 2 || step === 3 || step === 4 || awaitingEmailConfirm;

  // -----------------------------
  // GREETING
  // -----------------------------
  async function loadGreeting() {
    const res = await fetch(`${API_BASE}/greeting`);
    const data = await res.json();

    setMessages([
      {
        role: "assistant",
        content: data.message,
      },
    ]);
  }

  useEffect(() => {
    if (didFetchGreeting.current) return;
    didFetchGreeting.current = true;
    loadGreeting();
  }, []);

  // -----------------------------
  // AUTO SCROLL
  // -----------------------------
  useEffect(() => {
    const el = document.getElementById("chat-scroll");
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping, activeAgent]);

  // -----------------------------
  // SEND MESSAGE
  // -----------------------------
  async function handleSend() {
    if (!input.trim() || showEmailBox || disableSend) return;

    const userMsg = input;
    setInput("");

    // 1️⃣ Add user message
    setMessages(prev => [
      ...prev,
      { role: "client", content: userMsg }
    ]);

    // 2️⃣ Add thinking message
    //const thinkingId = Date.now();

    setMessages(prev => [
      ...prev,
      {
        role: "assistant",
        content: "Thinking…",
        thinking: true
      }
    ]);

    try {
      // Optional small delay (UX polish)
      await new Promise(r => setTimeout(r, 400));

      const res = await sendMessage(userMsg, sessionId);
      setSessionId(res.session_id);

      // 3️⃣ Replace thinking message with real response
      setMessages(prev => {
        const copy = [...prev];
        copy.pop(); // remove thinking
        copy.push({
          role: "assistant",
          content: res.reply
        });
        return copy;
      });

      if (res.confirmed) setStep(1);

    } catch {
      setMessages(prev => {
        const copy = [...prev];
        copy.pop(); // remove thinking
        copy.push({
          role: "assistant",
          content: "⚠️ Backend error. Please try again."
        });
        return copy;
      });
    }
  }

  // -----------------------------
  // GENERATE PROPOSAL
  // -----------------------------
  async function handleGenerateProposal() {
    if (!sessionId) return;

    setIsGenerating(true);
    setStep(2);

    setMessages((prev) => [
      ...prev,
      {
        role: "system",
        content:
          "✅ Discovery confirmed. Our experts are now working on your solution…",
      },
    ]);

    setActiveAgent("BA Agent");
    await new Promise((r) => setTimeout(r, 1200));

    setActiveAgent("Solution Architect");
    await new Promise((r) => setTimeout(r, 1200));

    setActiveAgent("Proposal Agent");

    const res = await generateProposal(sessionId);

    setActiveAgent(null);

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: res.final_proposal },
      {
        role: "system",
        content: "📧 Would you like us to send this proposal to your email?",
      },
    ]);

    setStep(3);
    setShowEmailBox(true);
    setIsGenerating(false);
  }

  // -----------------------------
  // EMAIL CONFIRMATION
  // -----------------------------
  function handleEmailConfirmation(received: boolean) {
    if (received) {
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "🎉 Thanks! Our team will be in touch soon. Feel free to start a new conversation anytime.",
        },
      ]);

      setAwaitingEmailConfirm(false);

    } else {
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content:
            "⚠️ No worries. Emails sometimes go to Spam or Promotions.",
        },
        {
          role: "assistant",
          content: "Please re-enter your email and I’ll resend it.",
        },
      ]);

      setAwaitingEmailConfirm(false);
      setShowEmailBox(true);
    }
  }

  // -----------------------------
  // RESET CHAT
  // -----------------------------
  function resetChat() {
    setMessages([]);
    setSessionId(undefined);
    setStep(0);
    setIsGenerating(false);
    setIsTyping(false);
    setShowEmailBox(false);
    setAwaitingEmailConfirm(false);

    loadGreeting();
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="h-[100vh] bg-slate-900 text-slate-100 flex items-center justify-center">
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

          {activeAgent && (
            <div className="mt-2">
              <AgentThinking label={activeAgent} />
            </div>
          )}
        </div>

        {/* INPUT / EMAIL */}
        {!showEmailBox && !awaitingEmailConfirm && (
          <div className="shrink-0 border-t border-slate-800 px-4 py-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                className="flex-1 resize-none rounded-lg bg-slate-800 text-white px-3 py-2 text-base md:text-sm outline-none max-h-32 overflow-y-auto"
                rows={1}
                value={input}
                placeholder="Ask X AI..."
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
                className="h-10 w-10 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40"
              >
                ➤
              </button>

              {step === 1 && (
                <button
                  onClick={handleGenerateProposal}
                  className="h-10 px-4 rounded-lg bg-green-600 hover:bg-green-500"
                >
                  Generate Proposal
                </button>
              )}
            </div>
          </div>
        )}

        {showEmailBox && (
          <div className="shrink-0 border-t border-slate-800">
            <EmailBox
              onSend={async (email) => {
                await fetch(`${API_BASE}/send-proposal-email`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    session_id: sessionId,
                    email,
                  }),
                });


                setAwaitingEmailConfirm(true);
                setShowEmailBox(false);
                setStep(4);

                setMessages((prev) => [
                  ...prev,
                  {
                    role: "system",
                    content: `📨 Proposal sent to **${email}**`,
                  },
                  {
                    role: "assistant",
                    content: "Did you receive the email?",
                  },
                  {
                    role: "system",
                    content:
                      "⏳ It may take 1–2 minutes. Please check Spam / Promotions.",
                  },
                ]);
              }}
            />
          </div>
        )}

        {awaitingEmailConfirm && (
          <div className="shrink-0 border-t border-slate-800 px-4 py-3 flex gap-2 justify-center">
            <button
              onClick={() => handleEmailConfirmation(true)}
              className="px-4 py-2 rounded-lg bg-green-600"
            >
              ✅ Yes
            </button>
            <button
              onClick={() => handleEmailConfirmation(false)}
              className="px-4 py-2 rounded-lg bg-red-600"
            >
              ❌ Not yet
            </button>
          </div>
        )}

        {step === 4 && !awaitingEmailConfirm && (
          <div className="shrink-0 border-t border-slate-800 px-4 py-3 flex justify-center">
            <button
              onClick={resetChat}
              className="text-sm text-slate-400 hover:text-white underline"
            >
              🔄 Start a new conversation
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
