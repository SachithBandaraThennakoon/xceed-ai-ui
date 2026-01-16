import { useState } from "react";

type Props = {
  onSend: (email: string) => void;
};

export default function EmailBox({ onSend }: Props) {
  const [email, setEmail] = useState("");

  return (
    <div className="border-t border-slate-800 bg-slate-900">
      <div className="max-w-4xl mx-auto p-4 space-y-3">
        <p className="text-sm text-slate-400">
          📧 Would you like us to send this proposal to your email?
        </p>

        <div className="flex gap-2">
          <input
            type="email"
            placeholder="client@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-lg bg-slate-800 text-white px-3 py-2 outline-none"
          />

          <button
            onClick={() => onSend(email)}
            className="bg-blue-600 hover:bg-blue-500 px-4 rounded-lg text-white"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
