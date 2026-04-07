"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomeOverlayProps {
  userName: string;
  isOldUser: boolean;
}

export default function WelcomeOverlay({ userName, isOldUser }: WelcomeOverlayProps) {
  const [show, setShow] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Only set init state once
    if (typeof window !== "undefined" && !sessionStorage.getItem("welcomeShown")) {
      setShow(true);
      sessionStorage.setItem("welcomeShown", "true");
    }
  }, []);

  useEffect(() => {
    if (show) {
      const timer1 = setTimeout(() => setStage(1), 2200);   
      const timer2 = setTimeout(() => setStage(2), 5500);   
      const timer3 = setTimeout(() => setShow(false), 9000); 

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0, filter: "blur(30px)", scale: 1.05, transition: { duration: 1.2, ease: "easeInOut" } }}
           className="fixed inset-0 z-[1000] flex items-center justify-center bg-white/30 dark:bg-slate-950/40 backdrop-blur-3xl"
           style={{ pointerEvents: "auto" }} // Block clicking while it plays
        >
          {/* High-end SaaS abstract background glows instead of pure standard windows */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <motion.div 
               animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
               transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-blue-500/20 dark:bg-blue-600/20 rounded-full blur-[100px]"
             />
             <motion.div 
               animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.3, 0.1] }}
               transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
               className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full blur-[120px]"
             />
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] dark:opacity-[0.06] mix-blend-overlay" />
          </div>

          <div className="relative z-10 w-full max-w-4xl px-4 text-center text-slate-900 dark:text-white text-3xl md:text-[2.75rem] font-medium tracking-tight">
            <AnimatePresence mode="wait">
               {stage === 0 && (
                 <motion.div
                   key="hi"
                   initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                   animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                   exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
                   transition={{ duration: 1.2, ease: "easeInOut" }}
                 >
                   Hi
                 </motion.div>
               )}
               {stage === 1 && (
                 <motion.div
                   key="welcome"
                   initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                   animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                   exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
                   transition={{ duration: 1.2, ease: "easeInOut" }}
                 >
                   {isOldUser ? (
                     <>Welcome back, <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">{userName}</span></>
                   ) : (
                     <>Welcome, <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">{userName}</span></>
                   )}
                 </motion.div>
               )}
               {stage === 2 && (
                 <motion.div
                   key="message"
                   initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                   animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                   exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
                   transition={{ duration: 1.2, ease: "easeInOut" }}
                   className="flex flex-col items-center gap-12"
                 >
                   <div>
                     {isOldUser ? "Thank you for using our service." : "We ensure you fast service."}
                   </div>
                   
                   {/* Modern SaaS Loader */}
                   <div className="flex gap-2.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ 
                            scale: [1, 1.4, 1],
                            opacity: [0.4, 1, 0.4],
                            y: [0, -6, 0]
                          }}
                          transition={{ 
                            duration: 1.2, 
                            repeat: Infinity, 
                            delay: i * 0.2,
                            ease: "easeInOut"
                          }}
                          className="w-2.5 h-2.5 bg-blue-600 dark:bg-white rounded-full shadow-lg shadow-blue-500/50"
                        />
                      ))}
                   </div>
                 </motion.div>
               )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
