"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Lock, Mail, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/home";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Force reset the animation flag whenever user lands on login page
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("welcomeShown");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Login successful!");
      
      // Fetch session dynamically to see if the user is an admin
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      
      let finalRedirect = callbackUrl;
      const role = sessionData?.user?.role;
      if (role === "ADMIN" || role === "SUPER_ADMIN") {
        finalRedirect = "/dashboard";
      }

      router.refresh();
      router.push(finalRedirect);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex">
      {/* Left Decorative/Branding Panel */}
      <div className="hidden lg:flex flex-col flex-1 relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white overflow-hidden p-12">
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/30 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-3 mb-auto">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-xl">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight">IntelliQueue</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 max-w-lg mt-auto mb-auto"
        >
          <h1 className="text-5xl font-black mb-6 leading-tight">
            Streamline your flow.<br/>
            <span className="text-blue-200">Optimize waiting.</span>
          </h1>
          <p className="text-lg text-blue-100/80 leading-relaxed font-medium">
            Join thousands of branches saving countless hours using our state-of-the-art predictive queue optimization platform.
          </p>
        </motion.div>
        
        <div className="relative z-10 mt-auto text-sm font-medium text-white/50">
          © {new Date().getFullYear()} IntelliQueue Inc. All rights reserved.
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-xl shadow-blue-500/20">
               <Lock className="w-6 h-6 text-white" />
             </div>
             <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase tracking-tighter">IntelliQueue</span>
          </div>

          <div className="mb-8 lg:mb-12 text-center lg:text-left">
            <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2 leading-none">Hello!</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2 relative">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="off"
                  placeholder="name@company.com"
                  className="h-14 pl-12 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-600 shadow-sm text-base transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
                />
              </div>
            </div>
            <div className="space-y-2 relative">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="h-14 pl-12 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-600 shadow-sm text-base transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between pb-2">
               <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                 <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-600 border-slate-300" />
                 Remember me
               </label>
               <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">Forgot password?</a>
            </div>

            <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 transition-all hover:-translate-y-0.5" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Sign in"}
            </Button>
          </form>
          
          <div className="mt-10 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
            Don't have an account? <Link href="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Sign up</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
