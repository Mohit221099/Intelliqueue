"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { QrCode, Loader2, Camera, CheckCircle, Upload } from "lucide-react";

interface QRScannerProps {
  onScan: (tokenId: string, tokenNumber: string) => Promise<void>;
  isProcessing: boolean;
}

export default function QRScanner({ onScan, isProcessing }: QRScannerProps) {
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processResult = async (decodedText: string) => {
    console.log("📍 Result:", decodedText);
    try {
      const data = JSON.parse(decodedText);
      if (data && data.id && data.id !== lastScanned) {
        setLastScanned(data.id);
        await onScan(data.id, data.token || "QR");
        toast.success(`Verified: ${data.token || "User"}`);
      } else if (typeof decodedText === "string" && decodedText !== lastScanned) {
        setLastScanned(decodedText);
        await onScan(decodedText, "QR");
      }
    } catch (err) {
      if (decodedText !== lastScanned) {
        setLastScanned(decodedText);
        await onScan(decodedText, "QR");
      }
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        const scanner = new Html5QrcodeScanner(
          "qr-reader",
          { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            rememberLastUsedCamera: true,
            supportedScanTypes: [0] 
          },
          false
        );

        scanner.render(processResult, () => {});
        scannerRef.current = scanner;
      } catch (err) {
        console.error("Scanner init error:", err);
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, [onScan, lastScanned]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const html5QrCode = new Html5Qrcode("qr-reader-hidden");
    try {
      const decodedText = await html5QrCode.scanFile(file, true);
      await processResult(decodedText);
    } catch (err) {
      toast.error("Could not find a valid QR code in that image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden rounded-3xl">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-row items-center justify-between py-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <QrCode className="w-5 h-5 text-blue-600" />
          Verify Entry
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-xl gap-2 font-bold h-9 border-blue-200 text-blue-600 hover:bg-blue-50"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing || isUploading}
        >
          <Upload className="w-4 h-4" />
          Upload Image
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
          <div id="qr-reader" className="w-full bg-black min-h-[300px]" />
          <div id="qr-reader-hidden" className="hidden" />
          
          {(isProcessing || isUploading) && (
            <div className="absolute inset-0 bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-2" />
              <p className="font-black text-blue-700 dark:text-blue-400">AUTHENTICATING...</p>
            </div>
          )}

          {!isProcessing && lastScanned && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-5 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in zoom-in font-bold">
              <CheckCircle className="w-4 h-4" />
              Verified entry: {lastScanned.substring(0, 8)}...
            </div>
          )}

          <div className="p-6 bg-blue-50 dark:bg-blue-900/10 text-center border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-center gap-3 text-blue-700 dark:text-blue-400 font-bold text-sm">
              <Camera className="w-4 h-4" />
              SCAN LIVE OR UPLOAD SNAPSHOT
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
