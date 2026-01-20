import { useEffect, useState } from "react";

type Props = {
  label: string;
};

const PHASES = [
  "Thinking",
  "Analyzing",
  "Designing",
  "Preparing",
];

export default function AgentThinking({ label }: Props) {
  const [dots, setDots] = useState("");
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(10);

  // Animated dots (...)
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 450);

    return () => clearInterval(dotInterval);
  }, []);

  // Phase rotation (Thinking → Analyzing → ...)
  useEffect(() => {
    const phaseInterval = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % PHASES.length);
    }, 2200);

    return () => clearInterval(phaseInterval);
  }, []);

  // Progress animation
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((p) => (p >= 90 ? p : p + Math.random() * 8));
    }, 700);

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="mt-3 space-y-2 max-w-xl">
      {/* AGENT LINE */}
      <div className="flex items-center gap-2 text-cyan-300">
        <span className="animate-pulse">🤖</span>
        <span className="font-semibold">{label}</span>
      </div>

      {/* STATUS */}
      <div className="text-sm text-slate-400 italic pl-6">
        {PHASES[phaseIndex]}{dots}
      </div>

      {/* PROGRESS BAR */}
      <div className="pl-6">
        <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
          <div
            className="bg-cyan-500 h-1 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
