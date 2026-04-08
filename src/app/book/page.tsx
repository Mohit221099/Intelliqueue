import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Users, Zap, LayoutGrid, ChevronRight } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import WelcomeOverlay from './WelcomeOverlay';
import LogoutButton from '@/app/home/LogoutButton';

export const revalidate = 0; // Disable caching to fetch live branch status

export default async function BookPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  // Determine if it's a returning user
  const pastTokens = await prisma.token.count({
    where: { userId: session.user.id }
  });
  const isOldUser = pastTokens > 0;

  const branches = await prisma.branch.findMany({
    include: {
      services: true,
      _count: {
        select: { tokens: { where: { status: 'WAITING' } } }
      }
    }
  });

  return (
    <>
      <WelcomeOverlay userName={session.user.name || "User"} isOldUser={isOldUser} />
      
      <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#050505] selection:bg-blue-500 selection:text-white relative overflow-x-hidden flex flex-col">
        {/* Ambient Glows */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-[120px]" />
          <div className="absolute top-[30%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 dark:bg-indigo-600/10 blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay" />
        </div>

        {/* Toolbar Navigation */}
        <header className="relative z-20 w-full h-auto sm:h-20 border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-black/50 backdrop-blur-xl flex flex-col sm:flex-row items-center px-6 md:px-12 py-4 sm:py-0 justify-between gap-4 sticky top-0">
          <div className="flex items-center gap-3 w-full sm:w-auto">
             <div className="w-10 h-10 flex items-center justify-center bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
               <Zap className="w-5 h-5 text-white" />
             </div>
             <div className="flex items-center">
               <span className="font-black text-xl tracking-tighter text-slate-900 dark:text-white mr-3 uppercase">
                 IntelliQueue
               </span>
               <span className="hidden md:block text-slate-300 dark:text-slate-700 mr-3">/</span>
               <span className="hidden md:flex font-medium text-xs text-slate-600 dark:text-slate-300 items-center gap-2 bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full">
                  <LayoutGrid className="w-4 h-4" /> NODE SELECT
               </span>
             </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
             <Link href="/home" className="flex-1 sm:flex-none">
               <Button variant="ghost" className="w-full sm:w-auto font-black text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-full bg-slate-100 dark:bg-white/5 transform transition-transform active:scale-95">
                 GO BACK
               </Button>
             </Link>
             <LogoutButton />
          </div>
        </header>

        <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 py-10 md:py-16">
          <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-2 leading-none uppercase">
                Service <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Nodes</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm md:text-lg max-w-xl font-medium leading-relaxed">
                Connect to a decentralized branch node to initialize your intelligent token session.
              </p>
            </div>
            <div className="inline-flex items-center self-center md:self-end gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 font-black text-xs tracking-widest">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              LIVE STATUS ACTIVE
            </div>
          </div>

          {branches.length === 0 ? (
            <div className="text-center py-24 bg-white/60 dark:bg-[#111111]/80 rounded-[2rem] border border-slate-200 dark:border-white/5 backdrop-blur-xl shadow-2xl shadow-slate-200/40 dark:shadow-none">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto mb-6 shadow-sm">
                <MapPin className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No active nodes</h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto">Please stand by while new endpoints are provisioned. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {branches.map((branch) => (
                <div key={branch.id} className="group relative overflow-hidden rounded-[2rem] bg-white/70 dark:bg-[#111111]/90 backdrop-blur-2xl border border-slate-200 dark:border-white/5 p-8 shadow-xl shadow-slate-200/40 dark:shadow-none hover:border-blue-500/40 dark:hover:border-blue-500/30 transition-all duration-500 flex flex-col h-full hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20 hover:-translate-y-1">
                  
                  {/* Card Glow Effect */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                  
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center shadow-sm">
                      <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-xs font-bold tracking-wide shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      OPEN
                    </div>
                  </div>

                  <div className="relative z-10 flex-1">
                    <h2 className="text-[1.35rem] leading-tight font-extrabold text-slate-900 dark:text-white mb-2">{branch.name}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8">
                      {branch.location}
                    </p>
                    
                    <div className="space-y-4 mb-10 bg-slate-50/80 dark:bg-black/30 p-5 rounded-2xl border border-slate-100 dark:border-white/5">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-semibold">
                          <Users className="w-4 h-4" /> Current Load
                        </span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          <span className="text-blue-600 dark:text-blue-400 text-base">{branch._count.tokens}</span> <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">waiting</span>
                        </span>
                      </div>
                      
                      <div className="h-px w-full bg-slate-200 dark:bg-white/5" />
                      
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-semibold">
                          <Clock className="w-4 h-4" /> Servicing Hours
                        </span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono tracking-tight bg-slate-200 dark:bg-white/10 px-2 py-1 rounded">
                           {branch.workingHours || '09:00 - 17:00'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 mt-auto">
                    <Link href={`/book/${String(branch.id)}`} className="w-full block">
                      <Button className="w-full h-14 rounded-xl bg-slate-900 hover:bg-blue-600 dark:bg-white dark:hover:bg-blue-500 dark:text-slate-900 transition-all duration-300 flex items-center justify-center gap-2 font-bold shadow-xl shadow-slate-900/10 hover:shadow-blue-500/25 group/btn">
                        Initialize Token 
                        <ChevronRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
