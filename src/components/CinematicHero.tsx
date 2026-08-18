"use client";

import React, { useState } from "react";
import {
  Star,
  Clock,
  Shield,
  Play,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Layers,
} from "lucide-react";
import { Voucher } from "@/hooks/useVoucherContract";
import { ClaimResult } from "@/lib/stellar";

interface CinematicHeroProps {
  voucher: Voucher;
  voucherIndex: number;
  totalVouchers: number;
  isClaiming: boolean;
  claimReceipt: ClaimResult | null;
  toastMessage: string | null;
  onClaimVoucher: () => void;
  onNextVoucher: () => void;
  onPrevVoucher: () => void;
  onOpenDetails: () => void;
  onDismissReceipt: () => void;
  onOpenActivity: () => void;
}

export function CinematicHero({
  voucher,
  voucherIndex,
  totalVouchers,
  isClaiming,
  claimReceipt,
  toastMessage,
  onClaimVoucher,
  onNextVoucher,
  onPrevVoucher,
  onOpenDetails,
  onDismissReceipt,
  onOpenActivity,
}: CinematicHeroProps) {
  const [showVoucherPreview, setShowVoucherPreview] = useState(false);

  return (
    <div className="relative z-10 flex-1 flex flex-col justify-end px-4 sm:px-6 md:px-12 pb-8 md:pb-16 w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-blur-fade-up max-w-md w-[90%] pointer-events-auto">
          <div className="liquid-glass bg-black/80 backdrop-blur-xl border border-white/20 px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 text-sm text-white">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-sky-400 shrink-0 animate-spin" />
              <p className="text-xs sm:text-sm font-medium">{toastMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Grid */}
      <div className="flex flex-col lg:flex-row items-end justify-between gap-8">
        {/* Left Hero Content */}
        <div className="max-w-3xl space-y-4 md:space-y-6">
          {/* Metadata Row (300ms delay) */}
          <div
            className="animate-blur-fade-up flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300 font-medium select-none"
            style={{ animationDelay: "300ms" }}
          >
            <div className="liquid-glass flex items-center gap-1.5 px-3 py-1.5 rounded-full">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Stellar Testnet</span>
            </div>

            <div className="liquid-glass flex items-center gap-1.5 px-3 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Instant Settlement</span>
            </div>

            <div className="liquid-glass flex items-center gap-1.5 px-3 py-1.5 rounded-full">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Soroban Secured</span>
            </div>
          </div>

          {/* Hero Title (400ms delay) */}
          <h1
            className="animate-blur-fade-up text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] select-none"
            style={{
              animationDelay: "400ms",
              letterSpacing: "-0.04em",
            }}
          >
            Step Through.
            <br />
            Work Smarter.
          </h1>

          {/* Hero Description (500ms delay) */}
          <p
            className="animate-blur-fade-up text-sm sm:text-base md:text-lg text-gray-400 max-w-xl leading-relaxed select-none"
            style={{ animationDelay: "500ms" }}
          >
            A voyage through forgotten realms, where past and future intertwine.
          </p>

          {/* Active Voucher Mini Pill */}
          <div
            className="animate-blur-fade-up flex items-center gap-3 pt-1 select-none"
            style={{ animationDelay: "550ms" }}
          >
            <div
              onClick={() => setShowVoucherPreview(!showVoucherPreview)}
              className="liquid-glass flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs text-gray-200">
                Selected: <strong className="text-white">{voucher.title}</strong>
              </span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md text-white font-mono">
                {voucher.value}
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {/* "Claim Voucher" Button (bg-white text-black, 600ms delay) */}
            <button
              onClick={onClaimVoucher}
              disabled={isClaiming}
              className="animate-blur-fade-up group relative flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-full bg-white text-black font-semibold text-sm sm:text-base hover:bg-gray-100 transition-all duration-200 shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] cursor-pointer disabled:opacity-75"
              style={{ animationDelay: "600ms" }}
            >
              {isClaiming ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Processing Claim...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-black transition-transform duration-200 group-hover:scale-110" />
                  <span>Claim Voucher</span>
                </>
              )}
            </button>

            {/* "Learn More" Button (Liquid Glass, 700ms delay) */}
            <button
              onClick={onOpenDetails}
              className="animate-blur-fade-up liquid-glass flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-full text-sm sm:text-base font-medium text-white hover:text-gray-200 cursor-pointer"
              style={{ animationDelay: "700ms" }}
            >
              <span>Learn More</span>
            </button>
          </div>
        </div>

        {/* Right Side: Navigation Arrows (800ms & 900ms delays) */}
        <div className="flex items-center gap-3 select-none shrink-0 self-end">
          {/* Previous Arrow Button (800ms delay) */}
          <button
            onClick={onPrevVoucher}
            className="animate-blur-fade-up liquid-glass flex items-center justify-center w-12 h-12 rounded-full text-white cursor-pointer group"
            style={{ animationDelay: "800ms" }}
            aria-label="Previous voucher"
            title="Previous voucher"
          >
            <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-white transition-transform group-hover:-translate-x-0.5" />
          </button>

          {/* Voucher Count Indicator */}
          <div
            className="animate-blur-fade-up liquid-glass px-3 py-2 rounded-full text-xs font-mono text-gray-300"
            style={{ animationDelay: "850ms" }}
          >
            {voucherIndex + 1} / {totalVouchers}
          </div>

          {/* Next Arrow Button (900ms delay) */}
          <button
            onClick={onNextVoucher}
            className="animate-blur-fade-up liquid-glass flex items-center justify-center w-12 h-12 rounded-full text-white cursor-pointer group"
            style={{ animationDelay: "900ms" }}
            aria-label="Next voucher"
            title="Next voucher"
          >
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Claim Receipt Modal */}
      {claimReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-blur-fade-up">
          <div className="liquid-glass bg-black/90 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-white/20 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Voucher Claim Confirmed!</h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Settled instantly on Stellar Soroban Testnet
              </p>
            </div>

            <div className="space-y-2 text-left bg-white/5 p-4 rounded-2xl border border-white/10 text-xs">
              <div className="flex justify-between text-gray-300">
                <span>Voucher ID:</span>
                <span className="font-mono text-white">#{claimReceipt.voucherId}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Claimed Value:</span>
                <span className="font-semibold text-emerald-400">${claimReceipt.amount} USDC</span>
              </div>
              {claimReceipt.ledger && (
                <div className="flex justify-between text-gray-300">
                  <span>Ledger Number:</span>
                  <span className="font-mono text-white">{claimReceipt.ledger}</span>
                </div>
              )}
              <div className="pt-2 border-t border-white/10">
                <span className="text-gray-400 block mb-1">Transaction Hash:</span>
                <p className="font-mono text-[11px] text-gray-300 truncate">
                  {claimReceipt.txHash}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={claimReceipt.explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-white text-black font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-gray-100 transition-colors"
              >
                <span>View on Stellar Expert</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={onDismissReceipt}
                className="py-3 px-4 rounded-xl liquid-glass text-xs font-medium text-white hover:bg-white/10 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
