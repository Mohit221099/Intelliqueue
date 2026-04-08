import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LayoutDashboard, Users, Clock, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden flex-col md:flex-row">
      {/* Sidebar - Desktop Only */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 uppercase tracking-tighter">
            IntelliQueue
          </span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold">
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </Link>
          <Link href="/dashboard/queue" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium">
            <Users className="w-5 h-5" />
            Live Queue
          </Link>
          <Link href="/dashboard/analytics" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium">
            <Clock className="w-5 h-5" />
            Audit Logs
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 font-bold">
              {session.user.name?.charAt(0) || "A"}
            </div>
            <div className="text-sm">
              <p className="font-bold text-slate-900 dark:text-white leading-none">{session.user.name}</p>
              <p className="text-slate-500 text-[10px] uppercase font-bold mt-1 tracking-widest">{session.user.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-14 sm:h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 md:hidden sticky top-0 z-20">
          <span className="font-black text-lg uppercase tracking-tighter text-blue-600">IntelliQueue</span>
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-black">
            {session.user.name?.charAt(0) || "A"}
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </div>

        {/* Mobile Navigation - Only on small screens */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-2 py-3 z-30 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-blue-600">
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase">Home</span>
          </Link>
          <Link href="/dashboard/queue" className="flex flex-col items-center gap-1 text-slate-400">
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase">Queue</span>
          </Link>
          <Link href="/dashboard/analytics" className="flex flex-col items-center gap-1 text-slate-400">
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase">Logs</span>
          </Link>
          <Link href="/home" className="flex flex-col items-center gap-1 text-slate-400">
            <LogOut className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase">Exit</span>
          </Link>
        </nav>
      </main>
    </div>
  );
}
