"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import InitialLoader from "@/app/home/InitialLoader";
import { ArrowRight, Zap, Brain, UtensilsCrossed, Landmark, HeartPulse, Activity, Check, Layers } from "lucide-react";

const VERTICALS = [
  {
    icon: UtensilsCrossed,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    title: "College Canteens",
    desc: "Pre-order meals from your phone. Walk in, pick up, walk out. No 30-minute queue at 1 PM.",
    tag: "JIS College · Live Demo"
  },
  {
    icon: Landmark,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    title: "Temples & Shrines",
    desc: "Book a darshan slot in advance. Arrive at your window. Eliminate 6-hour waits at sacred sites.",
    tag: "Tirupati · Dakshineswar"
  },
  {
    icon: HeartPulse,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    title: "Local Clinics & OPD",
    desc: "SMS-based queue booking. No app needed. Patients get a call when their turn is 10 minutes away.",
    tag: "Works on basic phones"
  },
  {
    icon: Activity,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
    title: "Govt. Jan Seva Centres",
    desc: "Digital India meets queue intelligence. Deployed at gram panchayats, RTO offices, ration shops.",
    tag: "Digital India Ready"
  }
];

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    period: "/month",
    desc: "For small canteens and pilot programs",
    features: ["1 queue counter", "Up to 50 tokens/day", "QR code generation", "Basic dashboard"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Starter",
    price: "₹999",
    period: "/month",
    desc: "For colleges, cafeterias, and clinics",
    features: ["5 queue counters", "Unlimited tokens", "SMS notifications", "Analytics & audit logs", "Mobile admin panel"],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Growth",
    price: "₹4,999",
    period: "/month",
    desc: "For temples, hospitals, enterprise",
    features: ["Unlimited counters", "AI demand forecasting", "No-show auto-backfill", "Custom branding", "API access", "Priority support"],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      <InitialLoader />
      <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500 selection:text-white relative overflow-x-hidden flex flex-col">
        {/* Ambient background glows */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-[120px]" />
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 dark:bg-indigo-600/10 blur-[120px]" />
        </div>

        {/* Navigation */}
        <header className="relative z-20 w-full max-w-7xl mx-auto h-20 flex items-center px-6 md:px-12 justify-between sticky top-0 bg-white/50 dark:bg-black/50 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl tracking-tighter text-slate-900 dark:text-white uppercase">IntelliQueue</span>
          </div>
          <div className="flex items-center gap-3">
            {session ? (
              <Link href="/home">
                <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 h-10 text-xs sm:text-sm shadow-lg shadow-blue-500/25">
                  CONSOLE
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" className="font-bold text-sm">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button className="rounded-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold px-5 h-10 text-xs sm:text-sm transition-transform active:scale-95 shadow-xl">
                    JOIN FREE
                  </Button>
                </Link>
              </>
            )}
          </div>
        </header>

        <main className="relative z-10 flex-1 flex flex-col items-center px-6">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-4xl text-center flex flex-col items-center pt-12 sm:pt-20 pb-16 sm:pb-24"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 dark:bg-orange-500/10 border border-orange-200/60 dark:border-orange-500/20 shadow-sm mb-8 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-black text-orange-700 dark:text-orange-400 uppercase tracking-widest">Queue Intelligence for Every Indian</span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6 text-slate-900 dark:text-white uppercase">
              Stop Waiting.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">Start Serving.</span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl leading-relaxed font-semibold">
              IntelliQueue is the universal SaaS OS for undigitized queues. From <strong className="text-slate-800 dark:text-white">college canteens to ancient temples</strong>, we eliminate wait times using AI-powered flow intelligence.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link href={session ? "/book" : "/register"} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-14 px-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/30 font-black text-base transition-transform active:scale-95 uppercase">
                  Launch Demo <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#pricing" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 rounded-full font-black text-base uppercase border-2">
                  Pricing
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Verticals Section */}
          <section className="w-full max-w-6xl mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase mb-4">One Platform. Every Queue.</h2>
              <p className="text-slate-500 font-semibold max-w-lg mx-auto">Digitizing the 10 Billion hours Indians waste in queues every year.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VERTICALS.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-6 rounded-[2rem] bg-white dark:bg-slate-900 border ${v.border} shadow-lg hover:-translate-y-2 transition-transform duration-300`}
                >
                  <div className={`w-12 h-12 rounded-2xl ${v.bg} flex items-center justify-center mb-4`}>
                    <v.icon className={`w-6 h-6 ${v.color}`} />
                  </div>
                  <h3 className="font-black text-slate-900 dark:text-white text-xl tracking-tight mb-2 uppercase">{v.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">{v.desc}</p>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${v.color} ${v.bg} px-3 py-1 rounded-full`}>{v.tag}</span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="w-full max-w-5xl mb-32">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase mb-4">SaaS Pricing</h2>
              <p className="text-slate-500 font-semibold">Scaling from local kiosks to national shrines.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {PLANS.map((plan, i) => (
                <div
                  key={i}
                  className={`p-8 rounded-[2.5rem] border-2 flex flex-col relative ${plan.highlight
                    ? "bg-blue-600 border-blue-500 text-white shadow-2xl scale-105 z-10"
                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                  }`}
                >
                  <p className={`text-xs font-black uppercase tracking-widest mb-2 ${plan.highlight ? "text-blue-200" : "text-slate-400"}`}>{plan.name}</p>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-5xl font-black">{plan.price}</span>
                    <span className={`text-sm font-bold ${plan.highlight ? "text-blue-200" : "text-slate-400"}`}>{plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm font-semibold">
                        <Check className={`w-5 h-5 ${plan.highlight ? "text-blue-300" : "text-green-500"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full rounded-2xl h-12 font-black uppercase tracking-widest ${plan.highlight
                    ? "bg-white text-blue-600 hover:bg-blue-50"
                    : "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                  }`}>
                    {plan.cta}
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800 py-12 px-6 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} IntelliQueue · Universal Queue Intelligence · Built for India
          </p>
        </footer>
      </div>
    </>
  );
}
