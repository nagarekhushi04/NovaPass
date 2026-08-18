"use client";

import React from "react";
import { X, ShieldCheck, Zap, Layers, Cpu, ArrowRight } from "lucide-react";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimCTA: () => void;
}

export function DetailsModal({ isOpen, onClose, onClaimCTA }: DetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-blur-fade-up">
      <div className="liquid-glass bg-black/95 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-white/20 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">About NovaPass Architecture</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full liquid-glass flex items-center justify-center text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-3.5 text-xs text-gray-300">
          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-white font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Soroban Smart Contract Custody</span>
            </div>
            <p className="text-gray-400">
              Vouchers are provably scarce Rust WASM tokens deployed on Stellar Testnet with
              tamper-proof time-locks and single-use burn mechanisms.
            </p>
          </div>

          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Sub-3-Second Settlement & Zero Gas Friction</span>
            </div>
            <p className="text-gray-400">
              Transactions settle in seconds on Stellar with fee-bump sponsorship support, ensuring
              users never get blocked by gas or network overhead.
            </p>
          </div>

          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Dynamic Anti-Replay QR Codes</span>
            </div>
            <p className="text-gray-400">
              In-store Point-of-Sale (POS) scanner verifies rotating timestamped QR payloads to
              prevent screenshot duplication and replay attacks.
            </p>
          </div>
        </div>

        {/* Action */}
        <div className="pt-2">
          <button
            onClick={() => {
              onClose();
              onClaimCTA();
            }}
            className="w-full py-3 rounded-xl bg-white text-black font-semibold text-xs flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow-lg"
          >
            <span>Proceed to Claim Genesis Voucher</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
