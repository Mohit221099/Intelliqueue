"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import InitialLoader from "@/app/home/InitialLoader";
import LogoutButton from "@/app/home/LogoutButton";
import { ArrowRight, Clock, Activity, ShieldCheck, Layers, Zap } from "lucide-react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      <InitialLoader />
      <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500 selection:text-white relative overflow-x-hidden flex flex-col">
        {/* Ambient Glows */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-[120px]" />
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 dark:bg-indigo-600/10 blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-500/10 dark:bg-blue-400/5 blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay" />
        </div>
        
        {/* Refined Navigation */}
        <header className="relative z-20 w-full max-w-7xl mx-auto h-20 sm:h-24 flex items-center px-6 md:px-12 justify-between sticky top-0 bg-white/50 dark:bg-black/50 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
               <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl tracking-tighter text-slate-900 dark:text-white uppercase">
              IntelliQueue
            </span>
          </div>
          
          <div className="flex items-center gap-3">
             {session ? (
               <Link href="/home">
                 <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 font-bold px-5 sm:px-6 h-10 sm:h-11 text-xs sm:text-sm">
                   GO TO CONSOLE
                 </Button>
               </Link>
             ) : (
               <Link href="/login?callbackUrl=/book">
                 <Button className="rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white shadow-xl shadow-slate-900/10 dark:shadow-white/10 font-bold px-6 sm:px-8 h-10 sm:h-11 text-xs sm:text-sm transition-transform active:scale-95">
                   JOIN NOW
                 </Button>
               </Link>
             )}
          </div>
        </header>

        <main className="relative z-10 flex-1 flex flex-col items-center pt-10 sm:pt-16 pb-24 px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl text-center flex flex-col items-center"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 shadow-sm mb-8 sm:mb-10 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Enterprise Optimization</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-[5rem] font-black tracking-tighter leading-[1.0] mb-6 sm:mb-8 text-slate-900 dark:text-white uppercase">
              End the <br className="sm:hidden" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Wait.</span><br />
              Elevate <br className="sm:hidden" /> Service.
            </h1>

            <p className="text-sm sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 sm:mb-12 max-w-2xl leading-relaxed font-semibold">
              IntelliQueue eliminates physical waiting lines through predictive real-time algorithms. Engineered for public sector efficiency and reliability.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              {session ? (
                <Link href="/book" className="w-full sm:w-auto">
                   <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/30 font-bold text-base transition-transform active:scale-95">
                     START SESSION <ArrowRight className="ml-2 w-5 h-5" />
                   </Button>
                </Link>
              ) : (
                <Link href="/login?callbackUrl=/book" className="w-full sm:w-auto">
                   <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 text-white shadow-xl shadow-slate-900/20 dark:shadow-white/20 font-bold text-base transition-transform active:scale-95">
                     BOOK NOW <ArrowRight className="ml-2 w-5 h-5" />
                   </Button>
                </Link>
              )}
            </div>
          </motion.div>

          {/* Bento Grid Features */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-5xl mt-32 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Card 1 */}
            <div className="col-span-1 md:col-span-2 relative overflow-hidden rounded-[2rem] bg-white/50 dark:bg-[#111111]/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 p-8 md:p-12 shadow-2xl shadow-slate-200/40 dark:shadow-none group transition-colors hover:border-blue-500/30">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10 w-full md:w-3/4">
                 <div className="w-14 h-14 rounded-2xl bg-white dark:bg-blue-500/10 flex items-center justify-center mb-6 border border-slate-100 dark:border-blue-500/20 shadow-sm">
                   <Activity className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                 </div>
                 <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white tracking-tight">Predictive AI ETA</h3>
                 <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                   Our dynamic algorithm continuously analyzes branch performance and service times to give users precise arrival predictions. No more arriving early or waiting indefinitely.
                 </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="col-span-1 relative overflow-hidden rounded-[2rem] bg-white/50 dark:bg-[#111111]/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 p-8 shadow-2xl shadow-slate-200/40 dark:shadow-none group transition-colors hover:border-indigo-500/30">
               <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl transform translate-x-8 translate-y-8 group-hover:scale-110 transition-transform duration-700" />
               <div className="relative z-10">
                 <div className="w-14 h-14 rounded-2xl bg-white dark:bg-indigo-500/10 flex items-center justify-center mb-6 border border-slate-100 dark:border-indigo-500/20 shadow-sm">
                   <ShieldCheck className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                 </div>
                 <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white tracking-tight">Secure Access</h3>
                 <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                   Enterprise-grade secure endpoints with QR code verification.
                 </p>
               </div>
            </div>

            {/* Card 3 */}
            <div className="col-span-1 relative overflow-hidden rounded-[2rem] bg-white/50 dark:bg-[#111111]/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 p-8 shadow-2xl shadow-slate-200/40 dark:shadow-none group transition-colors hover:border-teal-500/30">
               <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-700" />
               <div className="relative z-10">
                 <div className="w-14 h-14 rounded-2xl bg-white dark:bg-teal-500/10 flex items-center justify-center mb-6 border border-slate-100 dark:border-teal-500/20 shadow-sm">
                   <Clock className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                 </div>
                 <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white tracking-tight">Live Tracking</h3>
                 <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                   Real-time connections deliver split-second token status updates.
                 </p>
               </div>
            </div>

            {/* Card 4 */}
            <div className="col-span-1 md:col-span-2 relative overflow-hidden rounded-[2rem] bg-white/50 dark:bg-[#111111]/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 p-8 md:p-12 shadow-2xl shadow-slate-200/40 dark:shadow-none group transition-colors hover:border-purple-500/30">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10 w-full md:w-3/4">
                 <div className="w-14 h-14 rounded-2xl bg-white dark:bg-purple-500/10 flex items-center justify-center mb-6 border border-slate-100 dark:border-purple-500/20 shadow-sm">
                   <Layers className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                 </div>
                 <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white tracking-tight">Systematic Restructuring</h3>
                 <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                   Automatically drops no-shows, balances VIP priorities, and optimizes service station workloads asynchronously to drastically optimize the flow.
                 </p>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
}
