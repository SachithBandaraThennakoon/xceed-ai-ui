import { motion } from "framer-motion";

export default function Sidebar({ step }: { step: number }) {
  const steps = [
    "Discovery",
    "Confirmed",
    "BA Agent",
    "Solution Architect",
    "Final Proposal",
  ];

  return (
    <motion.div
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-72 h-screen bg-slate-900 border-r border-slate-800 p-6"
    >
      <h2 className="text-lg font-bold mb-6">Xceed AI</h2>

      <ul className="space-y-4">
        {steps.map((s, i) => (
          <li
            key={s}
            className={`text-sm flex items-center gap-2 ${
              i === step
                ? "text-white font-semibold"
                : i < step
                ? "text-green-400"
                : "text-slate-500"
            }`}
          >
            {i < step ? "✔" : "●"} {s}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
