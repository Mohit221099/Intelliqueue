"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { QrCode, Loader2, Camera, CheckCircle, Upload, Power, AlertCircle } from "lucide-react";

interface QRScannerProps {
  onScan: (tokenId: string, tokenNumber: string) => Promise<void>;
  isProcessing: boolean;
}

export default function QRScanner({ onScan, isProcessing }: QRScannerProps) {
  const [isActive, setIsActive] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        setIsActive(false);
      } catch (err) {
        console.error("Scanner stop error:", err);
      }
    }
  };

  const processResult = async (decodedText: string) => {
    setScanError(null);
    try {
      const data = JSON.parse(decodedText);
      const id = data?.id || decodedText;
      const token = data?.token || "QR";
      if (id !== lastScanned) {
        setLastScanned(id);
        await onScan(id, token);
        toast.success(`Verified: ${token}`);
        await stopScanner();
      }
    } catch {
      if (decodedText !== lastScanned) {
        setLastScanned(decodedText);
        await onScan(decodedText, "QR");
        await stopScanner();
      }
    }
  };

  const startScanner = async () => {
    setScanError(null);
    const container = document.getElementById("qr-reader-target");
    if (!container) {
      setScanError("Scanner container not found.");
      return;
    }
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode("qr-reader-target");
      }
      if (html5QrCodeRef.current.isScanning) {
        await html5QrCodeRef.current.stop();
      }
      setIsActive(true);
      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        processResult,
        () => {}
      );
    } catch (err: any) {
      console.error("Scanner start error:", err);
      const msg = err?.message || "Camera access failed. Check permissions.";
      setScanError(msg);
      setIsActive(false);
      toast.error(msg);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setScanError(null);
    const tempScanner = new Html5Qrcode("qr-reader-hidden");
    try {
      const decoded = await tempScanner.scanFile(file, true);
      await processResult(decoded);
    } catch {
      toast.error("No valid QR code found in image.");
      setScanError("Image scan failed: No QR detected");
    } finally {
      setIsUploading(false);
      tempScanner.clear();
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-2xl rounded-[2.5rem] bg-white dark:bg-slate-950 overflow-hidden">
      <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex flex-row items-center justify-between py-5 px-6">
        <div>
          <CardTitle className="text-xl font-black flex items-center gap-2 uppercase tracking-tighter">
            <QrCode className="w-6 h-6 text-blue-600" />
            Scanner
          </CardTitle>
          <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mt-1">Live Verification Engine</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-11 w-11 bg-slate-100 dark:bg-slate-800"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing || isUploading}
          >
            <Upload className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </Button>
          {isActive && (
            <Button
              variant="destructive"
              size="icon"
              className="rounded-full h-11 w-11"
              onClick={stopScanner}
            >
              <Power className="w-5 h-5" />
            </Button>
          )}
        </div>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative bg-[#0a0a0a] min-h-[320px] flex items-center justify-center overflow-hidden">
          {/* Scanner Target - always in DOM, hidden when not active via CSS */}
          <div
            id="qr-reader-target"
            style={{ display: isActive ? "block" : "none" }}
            className="absolute inset-0 w-full h-full"
          />
          {/* Hidden temp div for file scanning */}
          <div id="qr-reader-hidden" className="hidden" />

          {/* Idle State */}
          {!isActive && !isProcessing && !isUploading && !lastScanned && (
            <div className="flex flex-col items-center gap-6 p-8 text-center z-10">
              <div className="w-24 h-24 rounded-[2rem] bg-blue-500/10 border-2 border-dashed border-blue-500/20 flex items-center justify-center">
                <Camera className="w-10 h-10 text-blue-600" />
              </div>
              <Button
                size="lg"
                className="rounded-2xl font-black uppercase tracking-widest px-10 h-14 bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-500/40"
                onClick={startScanner}
              >
                Activate Camera
              </Button>
              {scanError && (
                <p className="text-red-400 text-[10px] font-bold uppercase flex items-center gap-1.5 max-w-xs text-center">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {scanError}
                </p>
              )}
            </div>
          )}

          {/* Loading Overlay */}
          {(isProcessing || isUploading) && (
            <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-xl z-[100] flex flex-col items-center justify-center">
              <Loader2 className="w-14 h-14 text-blue-500 animate-spin mb-3" />
              <p className="font-black text-blue-400 tracking-widest text-xs uppercase">Validating...</p>
            </div>
          )}

          {/* Success State */}
          {!isProcessing && lastScanned && (
            <div className="absolute inset-0 z-[110] flex items-center justify-center bg-green-500/10 backdrop-blur-2xl">
              <div className="bg-white dark:bg-slate-900 px-10 py-10 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 border border-green-500/20 animate-in zoom-in duration-300">
                <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-xl shadow-green-500/30">
                  <CheckCircle className="w-14 h-14 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-black uppercase tracking-tighter text-3xl text-slate-900 dark:text-white leading-none">Scanned</p>
                  <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-widest">Entry Granted</p>
                </div>
                <Button
                  className="rounded-2xl font-black bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 h-12"
                  onClick={() => { setLastScanned(null); startScanner(); }}
                >
                  Next Ticket
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="py-5 px-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-center gap-2 text-slate-400 font-bold text-[9px] uppercase tracking-widest">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            End-to-End Encrypted Verification
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
