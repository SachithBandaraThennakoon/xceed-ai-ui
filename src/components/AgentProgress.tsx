export default function AgentProgress({ step }: { step: number }) {
  const percent =
    step === 2 ? 66 :
    step >= 3 ? 100 : 0;

  return (
    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
      <div
        className="bg-green-500 h-2 transition-all duration-700"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
