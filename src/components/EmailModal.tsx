export default function EmailModal({ onSend, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-slate-900 p-6 rounded-xl w-96">
        <h3 className="text-lg mb-4">Send Proposal</h3>

        <input
          type="email"
          placeholder="client@email.com"
          className="w-full bg-slate-800 p-2 rounded mb-4"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-slate-400">
            Cancel
          </button>
          <button onClick={onSend} className="bg-blue-600 px-4 py-1 rounded">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
