"use client";

import { useState, useEffect } from "react";
import { createToken } from "@/actions/queue";
import { useQueueStore } from "@/store/useQueueStore";
import { socket } from "@/lib/socket";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Clock, MapPin, Ticket, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

export default function BookingClient({ branch, user }: { branch: any, user: any }) {
  const [selectedService, setSelectedService] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentToken, setCurrentToken } = useQueueStore();

  useEffect(() => {
    // When a user has a token for this branch, we connect and join to listen to live queue updates
    if (currentToken && currentToken.branchId === branch.id) {
      if (!socket.connected) {
        socket.connect();
      }
      socket.emit("join-branch", branch.id);

      socket.on("token-called", (data: { tokenNumber: string, branchId: string }) => {
        // Evaluate position
        // This is a simplified frontend-only reaction for the demo.
        // A complete real-time engine should broadcast the entire updated queue map or recalculate.
        if (data.tokenNumber === currentToken.tokenNumber) {
          toast.success("It's your turn!", { duration: 10000 });
          setCurrentToken({ ...currentToken, status: "SERVING" });
        } else {
          toast.info(`Token ${data.tokenNumber} has been called. Queue moving!`);
        }
      });

      return () => {
        socket.off("token-called");
      };
    }
  }, [currentToken, branch.id, setCurrentToken]);

  const handleBookSpot = async () => {
    if (!selectedService) {
      toast.error("Please select a service type");
      return;
    }

    setIsSubmitting(true);
    const result = await createToken(branch.id, selectedService, user.id);
    if (result.success && result.token) {
      setCurrentToken({
        id: result.token.id,
        tokenNumber: result.token.tokenNumber,
        status: result.token.status,
        priority: result.token.priority,
        branchId: result.token.branchId,
        estimatedServeTime: result.token.estimatedServeTime,
      });
      toast.success("Virtual spot booked successfully!");
    } else {
      toast.error(result.error || "Failed to book spot");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="w-full">
      <Link href="/book" className="inline-flex items-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to locations
      </Link>

      <AnimatePresence mode="wait">
        {!currentToken ? (
          <motion.div
            key="booking-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none p-2 sm:p-4">
              <CardHeader>
                <CardTitle className="text-2xl sm:text-3xl font-bold">{branch.name}</CardTitle>
                <p className="text-slate-500 flex items-center gap-2 mt-2">
                  <MapPin className="w-4 h-4" /> {branch.location}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Select a Service</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {branch.services.map((svc: any) => (
                      <div
                        key={svc.id}
                        onClick={() => setSelectedService(svc.id)}
                        className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${
                          selectedService === svc.id
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                            : "border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold">{svc.name}</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-500 gap-1.5 mt-2">
                          <Clock className="w-4 h-4" />
                          <span>~{svc.avgDuration} min wait/person</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-6 border-t border-slate-100 dark:border-slate-800/50">
                <Button
                  className="w-full h-14 text-lg"
                  disabled={!selectedService || isSubmitting}
                  onClick={handleBookSpot}
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Confirm virtual spot"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="ticket-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-t-3xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="text-center pb-4">
                <p className="text-blue-100 font-bold tracking-widest uppercase text-[10px] mb-2 opacity-80">TOKEN NUMBER</p>
                <h1 className="text-6xl sm:text-7xl font-black tracking-tighter drop-shadow-2xl">
                  {currentToken.tokenNumber}
                </h1>
              </div>
              <div className="mt-8 bg-blue-800/40 rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-white/10">
                <div className="flex flex-col space-y-4 p-1">
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-blue-200 text-xs flex items-center gap-1.5 font-bold uppercase tracking-wider"><Clock className="w-4 h-4 text-blue-300" /> ETA</span>
                    <span className="font-mono font-black text-xl">
                      {currentToken.estimatedServeTime
                        ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(currentToken.estimatedServeTime))
                        : "00:00"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-blue-200 text-[10px] flex items-center gap-1.5 font-bold uppercase tracking-wider"><MapPin className="w-3.5 h-3.5 text-blue-300" /> Branch</span>
                    <span className="font-mono font-bold text-sm truncate max-w-[120px]">{branch.name}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-blue-200 text-[10px] flex items-center gap-1.5 font-bold uppercase tracking-wider"><User className="w-3.5 h-3.5 text-blue-300" /> User</span>
                    <span className="font-mono font-bold text-sm truncate max-w-[120px]">{user.name?.split(' ')[0]}</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-center bg-white p-4 rounded-xl mx-auto w-fit">
                <QRCodeSVG
                  value={JSON.stringify({ 
                    tokenId: currentToken.id, 
                    tokenNumber: currentToken.tokenNumber,
                    userId: user.id,
                    name: user.name
                  })}
                  size={120}
                  level="Q"
                  includeMargin={false}
                />
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 border border-t-0 border-slate-200 dark:border-slate-800 rounded-b-3xl p-6 w-full max-w-md shadow-xl flex flex-col gap-4">
               <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl mb-2 text-center border shadow-inner border-slate-100 dark:border-slate-800">
                 {currentToken.status === "SERVING" ? (
                   <>
                    <h3 className="text-xl font-bold text-green-600 dark:text-green-500 mb-1 animate-pulse">It's your turn!</h3>
                    <p className="text-sm text-slate-500">Please proceed to the counter immediately.</p>
                   </>
                 ) : (
                   <>
                    <h3 className="text-lg font-bold mb-1">Queue Active</h3>
                    <p className="text-sm text-slate-500">We will notify you here when your turn approaches.</p>
                   </>
                 )}
               </div>
               {currentToken.status !== "SERVING" && (
                 <Button variant="outline" className="w-full text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => setCurrentToken(null)}>
                   Cancel Appointment
                 </Button>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
