"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Clock, Zap, Target, History as HistoryIcon, RefreshCw } from "lucide-react";

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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl gap-2 font-semibold h-9"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Sync
          </Button>
          <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium rounded-full text-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Live Metrics
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Served</CardTitle>
            <Users className="w-5 h-5 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalServed}</div>
            <p className="text-xs text-green-500 mt-1 flex items-center font-medium">+14% from last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-md shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Current Queue Size</CardTitle>
            <Target className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.waitingCount}</div>
            <p className="text-xs text-slate-500 mt-1">Currently waiting</p>
          </CardContent>
        </Card>

        <Card className="shadow-md shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Avg Wait Time</CardTitle>
            <Clock className="w-5 h-5 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.averageWaitTime} min</div>
            <p className="text-xs text-green-500 mt-1 flex items-center font-medium">-2 mins optimized</p>
          </CardContent>
        </Card>

        <Card className="shadow-md shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Optimization</CardTitle>
            <Zap className="w-5 h-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">94%</div>
            <p className="text-xs text-slate-500 mt-1">AI Efficiency Score</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-md shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Historical Load Trends (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.historyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} 
                  />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-md shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Peak Hours (Daily Average)</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.peakHours} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: "12px", border: "none" }} />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-full shadow-md shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800">
             <CardHeader className="flex flex-row items-center justify-between">
               <CardTitle className="text-lg">Recent Audit</CardTitle>
               <HistoryIcon className="w-5 h-5 text-slate-400" />
             </CardHeader>
             <CardContent className="p-0">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                   {analytics.recentLogs.length === 0 ? (
                      <div className="p-12 text-center text-slate-400">No recent activity</div>
                   ) : (
                      analytics.recentLogs.map((log, idx) => (
                         <div key={log.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                               <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tighter">
                                  {log.action}
                               </p>
                               <span className="text-[10px] text-slate-400 font-mono">
                                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                               </span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1">{log.details}</p>
                            <p className="text-[10px] text-blue-500 mt-1 font-medium italic">by {log.adminName}</p>
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
