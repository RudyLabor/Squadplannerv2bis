import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);

      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(onComplete, 300);
      }
    };

    requestAnimationFrame(animate);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--bg-base)]"
      exit={{
        opacity: 0,
        transition: { duration: 0.4 }
      }}
    >
      {/* Background */}
      <div className="absolute inset-0 gradient-mesh opacity-40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        
        {/* Logo minimaliste */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-12 h-12 rounded-full bg-[var(--primary-500)]" />
        </motion.div>

        {/* Brand name */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-3xl font-normal text-[var(--fg-primary)] mb-2">
            Squad Planner
          </h1>
          <p className="text-sm text-[var(--fg-tertiary)]">
            Organize • Play • Win
          </p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="w-48"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="h-1 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-[var(--primary-500)]"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
