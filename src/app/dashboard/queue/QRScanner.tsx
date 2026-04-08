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
      }
    } catch (err) {
      if (decodedText !== lastScanned) {
        setLastScanned(decodedText);
        await onScan(decodedText, "QR");
      }
    }
  };

  const startScanner = async () => {
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode("qr-reader");
      }
      
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
    <Card className="border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900 transition-all duration-300">
      <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex flex-row items-center justify-between py-5 px-6">
        <div className="flex flex-col">
          <CardTitle className="text-xl font-black flex items-center gap-2 uppercase tracking-tighter">
            <QrCode className="w-6 h-6 text-blue-600" />
            Scanner
          </CardTitle>
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1">Verify Entry Tokens</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full h-10 w-10 bg-slate-100 dark:bg-slate-800"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing || isUploading}
        >
          <Upload className="w-5 h-5 text-slate-600 dark:text-slate-400" />
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
        <div className="relative">
          <div id="qr-reader" className="w-full bg-slate-900 aspect-square sm:aspect-video min-h-[300px] flex items-center justify-center overflow-hidden">
            {!isActive && !isUploading && (
              <div className="flex flex-col items-center gap-6 p-8">
                <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center animate-pulse">
                   <Camera className="w-10 h-10 text-blue-600" />
                </div>
                <Button 
                  size="lg"
                  className="rounded-2xl font-black uppercase tracking-widest px-8 h-14 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/25"
                  onClick={startScanner}
                >
                  Start Camera
                </Button>
              </div>
            )}
          </div>
          <div id="qr-reader-hidden" className="hidden" />
          
          {(isProcessing || isUploading) && (
            <div className="absolute inset-0 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md flex flex-col items-center justify-center z-10 animate-in fade-in duration-300">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="font-black text-blue-700 dark:text-blue-400 tracking-widest text-sm">AUTHENTICATING...</p>
            </div>
          )}

          {isActive && (
            <div className="absolute top-4 right-4 z-20">
               <Button 
                  variant="destructive"
                  size="sm"
                  className="rounded-full h-10 w-10 flex items-center justify-center p-0 shadow-lg"
                  onClick={stopScanner}
               >
                 <Power className="w-5 h-5" />
               </Button>
            </div>
          )}

          {!isProcessing && lastScanned && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="bg-green-600 text-white px-8 py-4 rounded-3xl shadow-2xl flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-500">
                   <CheckCircle className="w-10 h-10" />
                   <p className="font-black uppercase tracking-widest text-xs">Verified</p>
                </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-center gap-3 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Vercel Optimized Secure Capture
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
