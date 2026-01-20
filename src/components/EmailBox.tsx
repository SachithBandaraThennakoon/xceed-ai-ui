import { useState } from "react";

type EmailBoxProps = {
  onSend: (email: string) => Promise<void> | void;
};

export default function EmailBox({ onSend }: EmailBoxProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await onSend(email);
      setEmail("");
    } catch {
      setError("Failed to send email. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-t border-slate-800 bg-slate-900">
      <div className="max-w-4xl mx-auto p-4 space-y-3">

        <p className="text-sm bg-cyan-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 ring-1 ring-slate-900">
          📧 Please enter your email address to receive the proposal
        </p>


        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            placeholder="client@company.com"
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="flex-1 rounded-lg bg-slate-800 text-white px-3 py-2 outline-none disabled:opacity-50"
          />

          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-4 py-2 rounded-lg text-white"
          >
            {loading ? "Sending…" : "Send"}
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-400">
            {error}
          </p>
        )}

      </div>
    </div>
  );
}
