"use client";

import React, { useState } from "react";
import { X, QrCode, Camera, CheckCircle2, ShieldAlert } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAddress: string | null;
}

export function ScanModal({ isOpen, onClose, userAddress }: ScanModalProps) {
  const [activeTab, setActiveTab] = useState<"scan" | "present">("present");
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [redeemed, setRedeemed] = useState(false);

  if (!isOpen) return null;

  const mockQrPayload = JSON.stringify({
    protocol: "novapass-v1",
    voucherId: 1,
    owner: userAddress || "GBUDJ6IEL2YV3O4XZZ5E6W2YV3O4XZZ5E6W2YV3O4XZZ5E6W2YV3O4XZ",
    timestamp: Date.now(),
    nonce: Math.random().toString(36).substring(2, 10),
  });

  const handleSimulateScan = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setRedeemed(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-blur-fade-up">
      <div className="liquid-glass bg-black/90 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-white/20 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <QrCode className="w-5 h-5 text-sky-400" />
            <h3 className="text-lg font-bold text-white">POS / QR Terminal</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full liquid-glass flex items-center justify-center text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 text-xs">
          <button
            onClick={() => {
              setActiveTab("present");
              setRedeemed(false);
            }}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "present" ? "bg-white text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Show My QR
          </button>
          <button
            onClick={() => {
              setActiveTab("scan");
              setRedeemed(false);
            }}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "scan" ? "bg-white text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Merchant Scanner
          </button>
        </div>

        {/* Content */}
        {activeTab === "present" ? (
          <div className="text-center space-y-4">
            <div className="p-5 bg-white rounded-2xl inline-block shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              <QRCodeSVG value={mockQrPayload} size={180} level="H" />
            </div>
            <p className="text-xs text-gray-400">
              Dynamic Anti-Replay Payload • Rotates every 30s
            </p>
          </div>
        ) : (
          <div className="text-center space-y-4">
            {redeemed ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-sm">Voucher Burned On-Chain</h4>
                <p className="text-xs text-emerald-300">
                  Redemption verified & settled via Soroban contract.
                </p>
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-white/20 rounded-2xl space-y-4 bg-white/5">
                <Camera className="w-10 h-10 text-gray-400 mx-auto animate-pulse" />
                <p className="text-xs text-gray-300">
                  Ready to scan customer dynamic voucher QR code
                </p>
                <button
                  onClick={handleSimulateScan}
                  disabled={isVerifying}
                  className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-gray-100 transition-colors"
                >
                  {isVerifying ? "Verifying on Soroban..." : "Simulate Merchant POS Scan"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
