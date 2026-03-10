'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

export default function LumeIntro() {
  const [status, setStatus] = useState<'visible' | 'hidden'>('visible');
  const [mounted, setMounted] = useState(true);
  const brandName = 'LUME';
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem('lume-intro-seen') === 'true';

    if (alreadySeen) {
      if (containerRef.current) {
        containerRef.current.style.display = 'none';
      }
      const t = setTimeout(() => setMounted(false), 0);
      return () => clearTimeout(t);
    }

    const hideTimer = setTimeout(() => {
      setStatus('hidden');
      sessionStorage.setItem('lume-intro-seen', 'true');
    }, 5000);

    const removeTimer = setTimeout(() => {
      setMounted(false);
    }, 6800);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div ref={containerRef}>
      <AnimatePresence mode="wait">
        {status === 'visible' && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'brightness(1.5) blur(10px)' }}
            transition={{ duration: 1.8, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed inset-0 z-[1000] flex flex-col items-center justify-center overflow-hidden bg-[#f5f2eb]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,1)_0%,_rgba(230,220,200,0.5)_100%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.06] contrast-150" />

            <div className="relative flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                className="mb-10 text-[#8c7a5b]"
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 40 40"
                  className="drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                >
                  <path
                    d="M20 5C11.7 5 5 11.7 5 20C5 28.3 11.7 35 20 35C22.5 35 24.8 34.3 26.8 33.2C21 32 16.5 26.5 16.5 20C16.5 13.5 21 8 26.8 6.8C24.8 5.7 22.5 5 20 5Z"
                    fill="currentColor"
                  />
                </svg>
              </motion.div>

              <div className="flex space-x-6">
                {brandName.split('').map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, filter: 'blur(8px)', x: 10 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', x: 0 }}
                    transition={{
                      duration: 2,
                      delay: 0.5 + index * 0.2,
                      ease: [0.2, 0, 0, 1],
                    }}
                    className="font-serif text-5xl font-extralight tracking-[0.1em] text-[#5c5241] md:text-8xl"
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 0.3 }}
                transition={{ delay: 2.2, duration: 2.5, ease: 'circOut' }}
                className="mt-8 h-[0.5px] w-[300px] bg-[#8c7a5b]"
              />

              <motion.p
                initial={{ opacity: 0, letterSpacing: '1em' }}
                animate={{ opacity: 1, letterSpacing: '0.6em' }}
                transition={{ delay: 3, duration: 2 }}
                className="mt-8 text-[10px] font-medium text-[#8c7a5b]/70 uppercase"
              >
                Fine Jewelry
              </motion.p>
            </div>

            <motion.div
              animate={{ x: ['-20%', '20%'], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="pointer-events-none absolute -top-1/2 left-0 h-[200%] w-[100%] rotate-12 bg-gradient-to-r from-transparent via-white to-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
