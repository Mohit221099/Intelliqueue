"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { processTokenAction } from "@/actions/admin";
import { socket } from "@/lib/socket";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Users, Clock, Loader2, FastForward, CheckCircle2, UserX, 
  RefreshCw, FileDown, History, QrCode, LayoutDashboard,
  ShieldCheck, ArrowRightLeft, UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import QRScanner from "./QRScanner";

interface TokenInfo {
  id: string;
  tokenNumber: string;
  status: string;
  priority: boolean;
  service: { name: string | null };
  user: { name: string | null };
}

interface LogEntry {
  id: string;
  action: string;
  adminName: string | null;
  timestamp: string | Date;
  details: string | null;
  tokenId: string;
}

export default function QueueClient({ 
  branchId, 
  waitingTokens, 
  servingTokens,
  logs 
}: { 
  branchId: string, 
  waitingTokens: TokenInfo[], 
  servingTokens: TokenInfo[],
  logs: LogEntry[]
}) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.emit("join-branch", branchId);
  }, [branchId]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 800);
    toast.success("Dashboard data refreshed.");
  };

  const handleAction = async (token: {id: string, tokenNumber: string}, action: "CALL" | "COMPLETE" | "SKIP") => {
    setIsProcessing(token.id);
    const result = await processTokenAction(token.id, action, branchId);
    
    if (result.success) {
      toast.success(action === "CALL" ? `Token ${token.tokenNumber} called!` : action === "COMPLETE" ? "Token completed." : "Token marked as no-show.");
      if (action === "CALL") {
        socket.emit("call-next", { branchId, tokenNumber: token.tokenNumber });
      }
    } else {
      toast.error(result.error);
    }
    setIsProcessing(null);
  };

  const exportLogs = () => {
    const headers = ["ID", "Action", "Admin", "Details", "Timestamp"];
    const csvContent = [
      headers.join(","),
      ...logs.map(log => [
        log.tokenId,
        log.action,
        log.adminName || "System",
        `"${log.details || ""}"`,
        new Date(log.timestamp).toLocaleString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `queue_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const currentServing = servingTokens.length > 0 ? servingTokens[0] : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Ops Control Center</h1>
          <p className="text-slate-500 text-sm md:text-base">Real-time branch queue coordination and auditor</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 md:flex-none rounded-xl gap-2 font-semibold"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 md:flex-none rounded-xl gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 font-semibold"
            onClick={exportLogs}
          >
            <FileDown className="w-4 h-4" />
            Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="queue" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md h-12 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl mb-6">
          <TabsTrigger value="queue" className="rounded-lg gap-2 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
            <LayoutDashboard className="w-4 h-4" />
            Queue
          </TabsTrigger>
          <TabsTrigger value="scan" className="rounded-lg gap-2 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
            <QrCode className="w-4 h-4" />
            Scanner
          </TabsTrigger>
          <TabsTrigger value="logs" className="rounded-lg gap-2 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
            <History className="w-4 h-4" />
            Audit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-6 focus-visible:ring-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
            {/* Active Counter Area */}
            <div className="lg:col-span-1 flex flex-col">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                Live Status
              </h2>
              <Card className="flex-1 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-slate-900 border-none shadow-2xl text-white overflow-hidden relative rounded-[2rem]">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
                <CardContent className="flex flex-col items-center justify-center p-8 h-full min-h-[400px]">
                  <AnimatePresence mode="wait">
                    {currentServing ? (
                      <motion.div 
                        key="serving"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="flex flex-col items-center text-center w-full"
                      >
                         <Badge className="bg-white/20 text-white border-white/20 hover:bg-white/20 px-4 py-1 rounded-full text-xs font-bold mb-6">
                            DESK 01 ACTIVE
                         </Badge>
                         <h1 className="text-8xl lg:text-9xl font-black drop-shadow-2xl mb-4 tracking-tighter">
                            {currentServing.tokenNumber}
                         </h1>
                         <div className="text-blue-100 font-bold text-xl mb-12 uppercase tracking-wide">
                            {currentServing.service.name ?? 'Unknown Service'}
                         </div>
                         
                         <div className="flex flex-col gap-3 w-full mt-auto">
                            <Button
                              variant="secondary"
                              className="w-full h-14 rounded-2xl bg-white hover:bg-slate-100 text-blue-700 shadow-xl font-black text-lg"
                              onClick={() => handleAction(currentServing, "COMPLETE")}
                              disabled={isProcessing === currentServing.id}
                            >
                              {isProcessing === currentServing.id ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : <CheckCircle2 className="w-6 h-6 mr-2" />} 
                              MARK COMPLETE
                            </Button>
                            <Button 
                              variant="ghost"
                              className="w-full h-12 rounded-2xl text-red-100 hover:bg-red-500/20 hover:text-white"
                              onClick={() => handleAction(currentServing, "SKIP")}
                              disabled={isProcessing === currentServing.id}
                            >
                              <UserX className="w-5 h-5 mr-2" /> Skip as No-Show
                            </Button>
                         </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center text-center px-4"
                      >
                        <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center mb-6">
                           <Users className="w-10 h-10 text-blue-200" />
                        </div>
                        <p className="text-2xl font-bold text-white">System Idle</p>
                        <p className="text-sm text-blue-100/60 mt-2 max-w-[200px]">Waiting for administrator to call the next ticket.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>

            {/* Waiting Queue List */}
            <div className="lg:col-span-2 flex flex-col h-full pl-0 lg:pl-6 border-l border-transparent lg:border-slate-200 lg:dark:border-slate-800">
               <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    Queue Waitlist <Badge variant="secondary" className="ml-2 font-mono text-xs px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-none">{waitingTokens.length}</Badge>
                  </h2>
               </div>
               
               <div className="flex-1 space-y-3 overflow-y-auto pr-2 pb-10">
                  {waitingTokens.length === 0 ? (
                    <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 border-dashed rounded-[2rem] flex flex-col items-center">
                       <Clock className="w-10 h-10 text-slate-300 mb-2" />
                       <p className="text-slate-500 font-medium">Virtual lobby is empty.</p>
                    </div>
                  ) : (
                    waitingTokens.map((token, idx) => (
                      <motion.div
                        key={token.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1, transition: { delay: idx * 0.05} }}
                      >
                        <Card className="flex items-center justify-between p-4 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-all relative overflow-hidden group rounded-2xl">
                          {token.priority && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500" />
                          )}
                          <div className="flex items-center gap-4">
                            <div className="bg-slate-50 dark:bg-slate-950 w-14 h-14 rounded-xl flex items-center justify-center text-lg font-black text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800 shadow-inner">
                              {token.tokenNumber}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2 truncate">
                                 {token.user.name ?? 'Guest'}
                                 {token.priority && <Badge className="bg-yellow-100 text-yellow-800 border-none text-[10px] h-4">VIP</Badge>}
                              </p>
                              <p className="text-xs text-slate-500 truncate font-medium">{token.service.name ?? 'General Service'}</p>
                            </div>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl h-10 px-4 border-slate-200 dark:border-slate-800 hover:bg-blue-600 hover:text-white transition-all font-bold whitespace-nowrap"
                            onClick={() => handleAction(token, "CALL")}
                            disabled={!!currentServing || isProcessing === token.id}
                          >
                             {isProcessing === token.id ? (
                               <Loader2 className="w-4 h-4 animate-spin" />
                             ) : (
                               <>Call Next <FastForward className="w-4 h-4 ml-2" /></>
                             )}
                          </Button>
                        </Card>
                      </motion.div>
                    ))
                  )}
               </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scan" className="focus-visible:ring-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
             <QRScanner 
               onScan={async (id) => {
                 // Scan logic: if we scan a QR and someone is currently serving, maybe don't trigger.
                 // Requirements: "if scan correctly then automatically the person will be called next"
                 if (!currentServing) {
                    await handleAction({ id, tokenNumber: "QR" }, "CALL");
                 } else {
                    toast.warning("Complete the current token before scanning the next entry.");
                 }
               }} 
               isProcessing={!!isProcessing} 
             />
             
             <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl p-8">
               <CardHeader className="p-0 mb-6">
                 <CardTitle className="text-lg">Automated Handler</CardTitle>
               </CardHeader>
               <div className="space-y-6">
                  <div className="flex gap-4 p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                     <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center shrink-0">
                        <UserCheck className="w-5 h-5 text-green-600" />
                     </div>
                     <div>
                        <p className="text-sm font-bold">Fast Validation</p>
                        <p className="text-xs text-slate-500 mt-1">Scan the customer's portal QR to automatically initiate their turn and verify identity.</p>
                     </div>
                  </div>
                  <div className="flex gap-4 p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                     <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                        <ArrowRightLeft className="w-5 h-5 text-blue-600" />
                     </div>
                     <div>
                        <p className="text-sm font-bold">Live Status Sync</p>
                        <p className="text-xs text-slate-500 mt-1">Successful scans push real-time updates to the customer's mobile dashboard instantly.</p>
                     </div>
                  </div>
               </div>
             </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="focus-visible:ring-0">
          <Card className="border-slate-200 dark:border-slate-800 shadow-xl rounded-[2rem] overflow-hidden">
             <div className="overflow-x-auto">
               <Table>
                 <TableHeader className="bg-slate-50 dark:bg-slate-900">
                   <TableRow className="border-b border-slate-200 dark:border-slate-800 hover:bg-transparent">
                     <TableHead className="font-bold">Token</TableHead>
                     <TableHead className="font-bold">Admin</TableHead>
                     <TableHead className="font-bold">Action</TableHead>
                     <TableHead className="font-bold">Timestamp</TableHead>
                     <TableHead className="font-bold">Details</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {logs.length === 0 ? (
                     <TableRow>
                       <TableCell colSpan={5} className="text-center py-10 text-slate-500 font-medium">No activity recorded yet for this branch.</TableCell>
                     </TableRow>
                   ) : (
                     logs.map((log) => (
                       <TableRow key={log.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                         <TableCell className="font-black text-blue-600 dark:text-blue-400">#{(log as any).tokenId?.substring(0, 5) || "N/A"}</TableCell>
                         <TableCell className="font-semibold">{log.adminName}</TableCell>
                         <TableCell>
                           <Badge className={
                             log.action === "CALL" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" :
                             log.action === "COMPLETE" ? "bg-green-100 text-green-700 hover:bg-green-100" :
                             "bg-slate-100 text-slate-700 hover:bg-slate-100"
                           }>
                             {log.action}
                           </Badge>
                         </TableCell>
                         <TableCell className="text-slate-500 text-xs">
                           {new Date(log.timestamp).toLocaleString()}
                         </TableCell>
                         <TableCell className="text-slate-600 dark:text-slate-400 text-sm italic">{log.details}</TableCell>
                       </TableRow>
                     ))
                   )}
                 </TableBody>
               </Table>
             </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
