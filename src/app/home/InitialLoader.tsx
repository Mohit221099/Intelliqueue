"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InitialLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Disable scrolling while loading
    document.body.style.overflow = "hidden";
    
    // Simulate loading time 
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "unset";
    }, 2800); 
    
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-slate-950 m-0 p-0"
        >
          {/* Animated Orbs */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Red/Orange Orb */}
            <motion.div
              className="absolute w-16 h-16 bg-[#F24E1E]/80 rounded-full mix-blend-multiply dark:mix-blend-screen shadow-[0_0_30px_rgba(242,78,30,0.5)]"
              animate={{
                x: [-24, 24, 24, -24, -24],
                y: [-24, -24, 24, 24, -24],
                scale: [1, 1.3, 1, 0.8, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Green Orb */}
            <motion.div
              className="absolute w-16 h-16 bg-[#0ACF83]/80 rounded-full mix-blend-multiply dark:mix-blend-screen shadow-[0_0_30px_rgba(10,207,131,0.5)]"
              animate={{
                x: [24, 24, -24, -24, 24],
                y: [24, -24, -24, 24, 24],
                scale: [1, 0.8, 1, 1.3, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
            />
            {/* Blue Orb */}
            <motion.div
              className="absolute w-16 h-16 bg-[#1ABCFE]/80 rounded-full mix-blend-multiply dark:mix-blend-screen shadow-[0_0_30px_rgba(26,188,254,0.5)]"
              animate={{
                x: [24, -24, -24, 24, 24],
                y: [-24, -24, 24, 24, -24],
                scale: [1, 1.3, 0.8, 1, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              }}
            />
             {/* Purple Orb */}
             <motion.div
              className="absolute w-16 h-16 bg-[#A259FF]/80 rounded-full mix-blend-multiply dark:mix-blend-screen shadow-[0_0_30px_rgba(162,89,255,0.5)]"
              animate={{
                x: [-24, -24, 24, 24, -24],
                y: [24, 24, -24, -24, 24],
                scale: [1, 0.8, 1.3, 1, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6,
              }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="mt-16 flex flex-col items-center gap-4"
          >
            <div className="flex gap-2 items-center">
              <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                IntelliQueue
              </span>
            </div>
            
            <div className="h-1.5 w-32 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden relative shadow-inner">
               <motion.div 
                 className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                 initial={{ width: "0%" }}
                 animate={{ width: "100%" }}
                 transition={{ duration: 2.4, ease: "easeInOut" }}
               />
            </div>
            <motion.p 
              className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              Loading Experience
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
