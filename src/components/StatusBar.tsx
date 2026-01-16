import { motion } from "framer-motion";

const steps = [
  "Discovery",
  "Confirmed",
  "BA Agent",
  "Architect",
  "Proposal",
];

type Props = {
  step: number;
};

export default function StatusBar({ step }: Props) {
  const currentLabel = steps[step] ?? "Discovery";
  const progressPercent = Math.round(((step + 1) / steps.length) * 100);

  return (
    <div className="border-t border-slate-800 bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-2">

        {/* ---------------- DESKTOP VIEW ---------------- */}
        <div className="hidden md:flex items-center justify-between">
          {steps.map((label, index) => {
            const isActive = index === step;
            const isDone = index < step;

            return (
              <div key={label} className="flex items-center flex-1">
                {/* DOT */}
                <motion.div
                  layout
                  className={`w-3 h-3 rounded-full ${
                    isDone
                      ? "bg-green-500"
                      : isActive
                      ? "bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                      : "bg-slate-600"
                  }`}
                />

                {/* LABEL */}
                <span
                  className={`ml-2 text-xs whitespace-nowrap ${
                    isActive
                      ? "text-white font-medium"
                      : isDone
                      ? "text-green-400"
                      : "text-slate-500"
                  }`}
                >
                  {label}
                </span>

                {/* CONNECTOR */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-px bg-slate-700 mx-3" />
                )}
              </div>
            );
          })}
        </div>

        {/* ---------------- MOBILE VIEW ---------------- */}
        <div className="md:hidden space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Step {step + 1} of {steps.length}
            </span>
            <span className="text-xs text-blue-400 font-medium">
              {currentLabel}
            </span>
          </div>

          {/* PROGRESS BAR */}
          <div className="w-full h-1 bg-slate-700 rounded overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
              className="h-1 bg-blue-500 rounded"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
