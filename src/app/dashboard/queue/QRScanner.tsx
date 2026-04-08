"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { QrCode, Loader2, Camera, CheckCircle, Upload, Power, SwitchCamera } from "lucide-react";

interface QRScannerProps {
  onScan: (tokenId: string, tokenNumber: string) => Promise<void>;
  isProcessing: boolean;
}

export default function QRScanner({ onScan, isProcessing }: QRScannerProps) {
  const [isActive, setIsActive] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processResult = async (decodedText: string) => {
    console.log("📍 Result:", decodedText);
    try {
      const data = JSON.parse(decodedText);
      const id = data?.id || decodedText;
      const token = data?.token || "QR";
      
      if (id !== lastScanned) {
        setLastScanned(id);
        await onScan(id, token);
        toast.success(`Verified: ${token}`);
        // Auto stop after successful scan to save battery and reduce DOM load
        stopScanner();
      }
    } catch (err) {
      if (decodedText !== lastScanned) {
        setLastScanned(decodedText);
        await onScan(decodedText, "QR");
        stopScanner();
      }
    }
  };

  const startScanner = async () => {
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode("qr-reader-container");
      }
      
      if (html5QrCodeRef.current.isScanning) return;
      
      setIsActive(true);
      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        processResult,
        () => {}
      );
    } catch (err) {
      console.error("Scanner start error:", err);
      toast.error("Could not access camera. Please check permissions.");
      setIsActive(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        setIsActive(false);
      } catch (err) {
        console.error("Scanner stop error:", err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const tempScanner = new Html5Qrcode("qr-reader-hidden");
    try {
      const decodedText = await tempScanner.scanFile(file, true);
      await processResult(decodedText);
    } catch (err) {
      toast.error("Could not find a valid QR code in that image.");
    } finally {
      setIsUploading(false);
      tempScanner.clear();
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 overflow-hidden">
      <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex flex-row items-center justify-between py-5 px-6">
        <div className="flex flex-col">
          <CardTitle className="text-xl font-black flex items-center gap-2 uppercase tracking-tighter">
            <QrCode className="w-6 h-6 text-blue-600" />
            Live Scanner
          </CardTitle>
          <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mt-1">Ready for Verification</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full h-11 w-11 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white transition-all transform active:scale-90"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing || isUploading}
        >
          <Upload className="w-5 h-5" />
        </Button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileUpload} 
        />
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="relative bg-slate-900 aspect-square sm:aspect-video min-h-[300px] sm:min-h-[380px] flex items-center justify-center overflow-hidden">
          {/* Stable Scanner Div - NEVER REMOVED FROM DOM */}
          <div id="qr-reader-container" className="absolute inset-0 w-full h-full" />
          <div id="qr-reader-hidden" className="hidden" />
          
          {/* UI Overlay - Using isActive to conditionally show buttons, but NOT removing the qr-reader itself */}
          {!isActive && !isProcessing && !isUploading && (
            <div className="relative z-20 flex flex-col items-center gap-6 p-8 animate-in fade-in duration-500">
              <div className="w-24 h-24 rounded-[2rem] bg-blue-500/10 border-2 border-dashed border-blue-500/30 flex items-center justify-center">
                 <Camera className="w-10 h-10 text-blue-600" />
              </div>
              <Button 
                size="lg"
                className="rounded-[1.5rem] font-black uppercase tracking-widest px-10 h-16 bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-500/40 text-sm transform transition-all hover:scale-105 active:scale-95"
                onClick={startScanner}
              >
                Launch Lens
              </Button>
            </div>
          )}

          {(isProcessing || isUploading) && (
            <div className="absolute inset-0 bg-white/60 dark:bg-slate-950/80 backdrop-blur-xl flex flex-col items-center justify-center z-30 animate-in fade-in duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
                <Loader2 className="relative w-16 h-16 text-blue-600 animate-spin mb-4" />
              </div>
              <p className="font-black text-blue-700 dark:text-blue-400 tracking-widest text-xs uppercase">Connecting to Node...</p>
            </div>
          )}

          {isActive && (
            <div className="absolute top-6 right-6 z-30">
               <Button 
                  variant="destructive"
                  size="icon"
                  className="rounded-full h-12 w-12 flex items-center justify-center p-0 shadow-2xl transform transition-all active:scale-75"
                  onClick={stopScanner}
               >
                 <Power className="w-6 h-6" />
               </Button>
            </div>
          )}

          {!isProcessing && lastScanned && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in duration-500">
                   <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                     <CheckCircle className="w-12 h-12 text-green-500" />
                   </div>
                   <div className="text-center">
                     <p className="font-black uppercase tracking-tighter text-2xl">Verified</p>
                     <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">Entry Granted</p>
                   </div>
                   <Button 
                    variant="outline" 
                    className="mt-2 rounded-xl font-bold"
                    onClick={() => {
                        setLastScanned(null);
                        startScanner();
                    }}
                   >
                     Scan Next
                   </Button>
                </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 dark:bg-black/20 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-center gap-3 text-slate-400 font-black text-[10px] uppercase tracking-widest opacity-60">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            IntelliScan Cloud Verified Engine
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
