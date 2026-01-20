import { motion } from "framer-motion";

const steps = [
  { label: "Discovery", icon: "🔍" },
  { label: "Confirmed", icon: "✅" },
  { label: "Agents Working", icon: "🤖" },
  { label: "Proposal", icon: "📄" },
  { label: "Emailed", icon: "📧" },
];

type Props = {
  step: number;
};

export default function StatusBar({ step }: Props) {
  const safeStep = Math.min(step, steps.length - 1);
  const current = steps[safeStep];

  const progressPercent = Math.round(
    ((safeStep + 1) / steps.length) * 100
  );

  return (
    <div className="border-t border-slate-800 bg-slate-900">
      <div className="max-w-4xl mx-auto px-3 py-2">

        {/* ================= DESKTOP ================= */}
        <div className="hidden md:flex justify-center">
          <div className="flex items-center">

            {steps.map((item, index) => {
              const isActive = index === safeStep;
              const isDone = index < safeStep;

              return (
                <div key={item.label} className="flex items-center">

                  {/* STEP */}
                  <div className="flex flex-col items-center w-20 text-center">

                    {/* DOT */}
                    <motion.div
                      layout
                      className={`w-3 h-3 rounded-full ${isDone
                          ? "bg-green-500"
                          : isActive
                            ? "bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                            : "bg-slate-600"
                        }`}
                    />

                    {/* LABEL */}
                    <span
                      className={`mt-1 text-xs flex items-center gap-1 justify-center ${isActive
                          ? "text-white font-medium"
                          : isDone
                            ? "text-green-400"
                            : "text-slate-500"
                        }`}
                    >
                      <span>{item.icon}</span>
                      {item.label}
                    </span>
                  </div>

                  {/* CONNECTOR */}
                  {index < steps.length - 1 && (
                    <div className="w-14 h-px bg-slate-700 mx-2" />
                  )}
                </div>
              );
            })}

          </div>
        </div>


        {/* ================= MOBILE ================= */}
        <div className="md:hidden space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Step {safeStep + 1} of {steps.length}
            </span>
            <span className="text-xs font-medium text-blue-400 flex items-center gap-1">
              <span>{current.icon}</span>
              {current.label}
            </span>
          </div>

          {/* PROGRESS BAR */}
          <div className="w-full h-1 bg-slate-700 rounded overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4 }}
              className={`h-1 rounded ${safeStep === steps.length - 1
                  ? "bg-green-500"
                  : "bg-blue-500"
                }`}
            />
          </div>

          {/* FINAL STATE MESSAGE */}
          {safeStep === steps.length - 1 && (
            <div className="text-xs text-green-400 text-center mt-1">
              ✅ Proposal successfully emailed
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
