"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Clock, Zap, Target, History as HistoryIcon, RefreshCw, Braille as Brain, TrendingUp, AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";

interface AnalyticsProps {
  totalServed: number;
  averageWaitTime: number;
  waitingCount: number;
  peakHours: { hour: string; count: number }[];
  historyData: { day: string; count: number }[];
  recentLogs: any[];
}

export default function DashboardClient({ analytics }: { analytics: AnalyticsProps }) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // High-Fidelity AI Mock Data for Demo
  const aiPredictions = {
    tomorrowPeak: "12:30 PM – 1:45 PM",
    forecastedTokens: 347,
    noShowRate: "8.3%",
    recommendation: "Open Table 3 by 12:00 PM. Pre-warm 180 Thali orders by 11:45 AM.",
    modelStatus: "Optimal",
    efficiencyDelta: "+12%"
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Admin Control</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Live Intelligence Hub</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl gap-2 font-black h-9 border-2"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Sync
          </Button>
          <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-black rounded-full text-xs flex items-center gap-2 uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Active
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 border-0 text-white shadow-xl shadow-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5">
            <CardTitle className="text-xs font-black uppercase tracking-widest opacity-70">Total Served</CardTitle>
            <Users className="w-4 h-4 opacity-70" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-4xl font-black tracking-tighter">{analytics.totalServed}</div>
            <p className="text-xs mt-1 text-blue-200 font-bold">+14% this month</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5">
            <CardTitle className="text-xs font-black text-slate-500 uppercase tracking-widest">Waiting</CardTitle>
            <Target className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-4xl font-black tracking-tighter">{analytics.waitingCount}</div>
            <p className="text-xs text-slate-400 mt-1 font-bold">Currently in queue</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5">
            <CardTitle className="text-xs font-black text-slate-500 uppercase tracking-widest">Avg Wait</CardTitle>
            <Clock className="w-4 h-4 text-teal-500" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-4xl font-black tracking-tighter">{analytics.averageWaitTime}m</div>
            <p className="text-xs text-green-500 mt-1 font-black">↓ 2 min optimized</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5">
            <CardTitle className="text-xs font-black text-slate-500 uppercase tracking-widest">AI Efficiency</CardTitle>
            <Zap className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-4xl font-black tracking-tighter">94%</div>
            <p className="text-xs text-slate-400 mt-1 font-bold">Flow optimization index</p>
          </CardContent>
        </Card>
      </div>

      {/* AI PREDICTION PANEL */}
      <Card className="border-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <CardHeader className="px-6 pt-6 pb-4 border-b border-white/5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-white font-black text-lg uppercase tracking-tighter">Predictive Flow Intelligence</CardTitle>
                <p className="text-blue-300/70 text-[10px] font-bold uppercase tracking-widest">Neural demand forecasting engine</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-400/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-300 text-[10px] font-black uppercase tracking-widest">Model: {aiPredictions.modelStatus}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-6 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-2">Tomorrow's Peak</p>
              <p className="text-xl font-black text-white leading-none">{aiPredictions.tomorrowPeak}</p>
              <p className="text-blue-300/60 text-[10px] mt-1 font-semibold">Forecasted rush window</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-2">Forecasted Demand</p>
              <p className="text-xl font-black text-white leading-none">{aiPredictions.forecastedTokens} tokens</p>
              <p className="text-blue-300/60 text-[10px] mt-1 font-semibold">Expected guest volume</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-2">No-Show Rate</p>
              <p className="text-xl font-black text-white leading-none">{aiPredictions.noShowRate}</p>
              <p className="text-green-400/80 text-[10px] mt-1 font-bold">Auto-backfill active ✓</p>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-400/20 rounded-2xl p-4 flex items-start gap-4">
            <Lightbulb className="w-6 h-6 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-300 text-[10px] font-black uppercase tracking-widest mb-1">AI Recommendation</p>
              <p className="text-white/90 text-sm font-semibold leading-relaxed">{aiPredictions.recommendation}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts & Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="font-black uppercase tracking-tighter text-sm">Historical Flow Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.historyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} className="text-xs font-bold" />
                  <YAxis axisLine={false} tickLine={false} className="text-xs font-bold" />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", fontSize: "12px" }} />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-full shadow-sm bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-black uppercase tracking-tighter text-sm text-slate-500">Recent Audit</CardTitle>
              <HistoryIcon className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {analytics.recentLogs.length === 0 ? (
                  <div className="p-12 text-center">
                    <CheckCircle2 className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 text-xs font-bold uppercase">System Stable</p>
                  </div>
                ) : (
                  analytics.recentLogs.map((log) => (
                    <div key={log.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                          {log.action}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{log.details}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
