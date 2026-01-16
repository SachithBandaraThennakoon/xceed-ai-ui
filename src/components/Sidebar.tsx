import { motion } from "framer-motion";

export default function Sidebar({
  step,
  open,
  onClose,
}: {
  step: number;
  open: boolean;
  onClose: () => void;
}) {
  const steps = [
    "Discovery",
    "Confirmed",
    "BA Agent",
    "Solution Architect",
    "Final Proposal",
  ];

  return (
    <>
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <motion.div
        initial={false}
        animate={{
          x: open ? 0 : "-100%",
        }}
        className="fixed md:static z-40 w-72 h-screen bg-slate-900 border-r border-slate-800 p-6
                   md:translate-x-0"
      >
        <h2 className="text-lg font-bold mb-6">Xceed AI</h2>

        <ul className="space-y-4">
          {steps.map((s, i) => (
            <li
              key={s}
              className={`text-sm ${
                i === step
                  ? "text-white font-semibold"
                  : i < step
                  ? "text-green-400"
                  : "text-slate-500"
              }`}
            >
              {i < step ? "✔" : "•"} {s}
            </li>
          ))}
        </ul>
      </motion.div>
    </>
  );
}
