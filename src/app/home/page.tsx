import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, Activity, Clock, ShieldCheck, Zap } from "lucide-react";
import LogoutButton from "@/app/home/LogoutButton";
import WelcomeOverlay from "@/app/book/WelcomeOverlay";

export const dynamic = 'force-dynamic';

export default async function UserHome() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Fetch active tokens
  const activeTokens = await prisma.token.findMany({
    where: {
      userId: session.user.id,
      status: { in: ["WAITING", "SERVING"] }
    },
    include: {
      branch: true,
      service: true
    },
    orderBy: { issuedAt: "desc" }
  });

  // Fetch historical tokens
  const historyTokens = await prisma.token.findMany({
    where: {
      userId: session.user.id,
      status: { in: ["COMPLETED", "SKIPPED", "CANCELLED"] }
    },
    include: {
      branch: true,
      service: true
    },
    orderBy: { issuedAt: "desc" },
    take: 5
  });

  const isOldUser = historyTokens.length > 0;

  return (
    <>
      <WelcomeOverlay userName={session.user.name || "User"} isOldUser={isOldUser} />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center">
        {/* Navigation */}
      <header className="w-full max-w-6xl mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 z-10 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <Link href="/">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              IntelliQueue
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <Link href="/book" className="flex-1 sm:flex-none">
            <Button variant="outline" className="rounded-full w-full sm:w-auto h-10 text-xs sm:text-sm font-bold border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400">Book Slot</Button>
          </Link>
          <LogoutButton />
        </div>
      </header>

      <main className="w-full max-w-6xl mx-auto px-6 py-12 flex-1">
        {/* Profile Header */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 mb-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center md:items-center justify-between relative overflow-hidden text-center md:text-left gap-6">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-gradient-to-l from-blue-500/10 to-transparent blur-[60px] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 z-10">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl md:text-3xl font-black shadow-lg shadow-blue-500/30 ring-4 ring-white dark:ring-slate-900">
              {session.user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Hi, {session.user.name?.split(' ')[0]}!
              </h1>
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 mt-2 text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 text-xs truncate max-w-[200px]"><User className="w-4 h-4" /> {session.user.email}</span>
                <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 pointer-events-none">
                  {session.user.role}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Tokens Queue */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Active Bookings
            </h2>
            
            {activeTokens.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">No active virtual queues</h3>
                <p className="text-slate-500 mb-6 max-w-sm">You dont have any active waitlist positions right now. Want to visit a branch?</p>
                <Link href="/book">
                  <Button className="rounded-full shadow-md shadow-blue-500/20">Book a Service Now</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {activeTokens.map(token => (
                  <div key={token.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col sm:flex-row justify-between items-center sm:items-stretch gap-6">
                    
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-blue-100 dark:border-blue-800/50 flex flex-col items-center justify-center text-center shadow-inner">
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">TOKEN</span>
                        <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{token.tokenNumber}</span>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{token.branch.name}</h3>
                        <p className="text-md text-slate-600 dark:text-slate-400 mt-1">{token.service.name}</p>
                        
                        <div className="flex items-center gap-3 mt-3">
                          <span className={"px-3 py-1 rounded-full text-xs font-bold " + (
                            token.status === "SERVING" 
                              ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300"
                          )}>
                            {token.status === "SERVING" ? "SERVED NOW" : "WAITING"}
                          </span>
                          
                          {token.estimatedServeTime && token.status === "WAITING" && (
                            <span className="text-sm font-medium text-slate-500 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> 
                              ETA: {new Date(token.estimatedServeTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {token.status === "WAITING" && (
                      <div className="flex flex-col justify-center w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 sm:pl-6">
                         <div className="text-center">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Priority</p>
                            {token.priority ? (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 font-bold border border-yellow-200">
                                ⭐ VIP
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-600 font-medium">Standard</div>
                            )}
                         </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* History */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              Recent History
            </h2>
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
              {historyTokens.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No previous visits recorded.</p>
              ) : (
                <div className="space-y-4">
                  {historyTokens.map(token => (
                    <div key={token.id} className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white truncate max-w-[150px]">{token.branch.name}</h4>
                        <p className="text-xs text-slate-500">{new Date(token.issuedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm font-semibold">{token.tokenNumber}</p>
                        <span className={"text-[10px] font-bold uppercase tracking-wider " + (
                          token.status === "COMPLETED" ? "text-green-600" :
                          token.status === "SKIPPED" ? "text-red-500" : "text-slate-500"
                        )}>
                          {token.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
