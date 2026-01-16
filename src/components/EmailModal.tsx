import { useState } from "react";

type Props = {
  onSend: (email: string) => void;
  onClose: () => void;
};

export default function EmailModal({ onSend, onClose }: Props) {
  const [email, setEmail] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-[90%] max-w-md">
        <h3 className="text-lg font-semibold mb-2">
          Send Proposal via Email
        </h3>

        <p className="text-sm text-slate-400 mb-4">
          Enter your email address to receive the proposal.
        </p>

        <input
          type="email"
          className="w-full bg-slate-800 text-white px-3 py-2 rounded mb-4 outline-none"
          placeholder="client@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            Skip
          </button>

          <button
            onClick={() => onSend(email)}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
            disabled={!email}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
