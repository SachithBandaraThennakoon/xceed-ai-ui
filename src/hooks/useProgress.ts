import { useEffect, useState } from "react";

export function useProgress(
  start: number,
  end: number,
  duration = 2000
) {
  const [progress, setProgress] = useState(start);

  useEffect(() => {
    const steps = Math.max(1, Math.floor(duration / 100));
    const increment = (end - start) / steps;

    let current = start;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      current += increment;
      setProgress(Math.min(Math.round(current), end));

      if (step >= steps) {
        clearInterval(interval);
        setProgress(end);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [start, end, duration]);

  return progress;
}
