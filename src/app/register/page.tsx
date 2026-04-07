"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Lock, Mail, User, Phone, Loader2, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("welcomeShown");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      toast.success("Account created! Signing you in...");
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (result?.error) throw new Error(result.error);
      router.refresh();
      router.push("/book");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-[2.5rem] p-6 sm:p-10 z-10">
        <div className="text-center mb-10">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-xl shadow-blue-500/20">
               <Zap className="w-6 h-6 text-white" />
             </div>
             <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">IntelliQueue</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white leading-none mb-3">JOIN US</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Initialize your membership profile below</p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
              <Input name="name" value={form.name} onChange={handleChange} required placeholder="John Doe"
                className="h-12 pl-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800" />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
              <Input name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="off" placeholder="you@example.com"
                className="h-12 pl-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800" />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
              <Input name="phone" type="tel" value={form.phone} onChange={handleChange} required placeholder="+91 98765 43210"
                className="h-12 pl-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
              <Input name="password" type="password" value={form.password} onChange={handleChange} required autoComplete="new-password" placeholder="Min. 6 characters"
                className="h-12 pl-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800" />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
              <Input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required autoComplete="new-password" placeholder="Repeat password"
                className="h-12 pl-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800" />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 rounded-xl text-md font-medium shadow-md shadow-blue-500/20 mt-2" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : <span className="flex items-center gap-2">Create Account <ArrowRight className="w-4 h-4" /></span>}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
