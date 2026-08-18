"use client";

import { useState } from "react";
import { executeVoucherClaim, ClaimResult } from "@/lib/stellar";
import confetti from "canvas-confetti";

export interface Voucher {
  id: number;
  title: string;
  merchant: string;
  category: string;
  value: string;
  claimAmount: number;
  remainingSupply: number;
  totalSupply: number;
  discountPercentage: string;
  expiresAt: string;
  isClaimed: boolean;
}

export const LIVE_VOUCHERS: Voucher[] = [
  {
    id: 1,
    title: "Genesis Access & VIP Pass",
    merchant: "NovaPass Foundation",
    category: "Genesis Pass",
    value: "$100 USDC",
    claimAmount: 100,
    remainingSupply: 842,
    totalSupply: 1000,
    discountPercentage: "100% OFF",
    expiresAt: "Dec 31, 2026",
    isClaimed: false,
  },
  {
    id: 2,
    title: "Quantum Cafe Loyalty Pass",
    merchant: "Quantum Coffee Lab",
    category: "Food & Beverage",
    value: "$25 Credit",
    claimAmount: 25,
    remainingSupply: 149,
    totalSupply: 200,
    discountPercentage: "Free Beverage",
    expiresAt: "Oct 15, 2026",
    isClaimed: false,
  },
  {
    id: 3,
    title: "CyberSound Festival 2026",
    merchant: "Aetheria Events",
    category: "Entertainment",
    value: "$150 Tier-1",
    claimAmount: 150,
    remainingSupply: 48,
    totalSupply: 500,
    discountPercentage: "VIP Access",
    expiresAt: "Nov 20, 2026",
    isClaimed: false,
  },
];

export function useVoucherContract() {
  const [vouchers, setVouchers] = useState<Voucher[]>(LIVE_VOUCHERS);
  const [activeVoucherIndex, setActiveVoucherIndex] = useState(0);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimReceipt, setClaimReceipt] = useState<ClaimResult | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeVoucher = vouchers[activeVoucherIndex];

  const nextVoucher = () => {
    setActiveVoucherIndex((prev) => (prev + 1) % vouchers.length);
  };

  const prevVoucher = () => {
    setActiveVoucherIndex((prev) => (prev - 1 + vouchers.length) % vouchers.length);
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#ffffff", "#38bdf8", "#818cf8", "#34d399"],
      });
    } catch {
      // Ignored if canvas is unmounted
    }
  };

  const claimActiveVoucher = async (userAddress: string | null): Promise<ClaimResult> => {
    if (!userAddress) {
      setToastMessage("Please connect your real Stellar Web3 wallet (Freighter / Albedo) first.");
      setTimeout(() => setToastMessage(null), 4000);
      return {
        success: false,
        txHash: "",
        voucherId: activeVoucher.id,
        amount: activeVoucher.claimAmount,
        explorerUrl: "",
        error: "Wallet not connected",
      };
    }

    setIsClaiming(true);
    setToastMessage("Broadcasting transaction to Stellar Testnet ledger...");

    try {
      const result = await executeVoucherClaim(
        userAddress,
        activeVoucher.id,
        activeVoucher.claimAmount
      );

      if (result.success && result.txHash) {
        setClaimReceipt(result);
        setVouchers((prev) =>
          prev.map((v, i) =>
            i === activeVoucherIndex
              ? {
                  ...v,
                  remainingSupply: Math.max(0, v.remainingSupply - 1),
                  isClaimed: true,
                }
              : v
          )
        );
        triggerCelebration();
        setToastMessage(`🎉 Confirmed on Stellar Ledger #${result.ledger || ""}`);
      } else {
        throw new Error(result.error || "Transaction failed on Testnet.");
      }

      setTimeout(() => setToastMessage(null), 6000);
      return result;
    } catch (err: any) {
      console.error("Live claim error:", err);
      const errorMsg = err?.message || "Transaction broadcast failed";
      setToastMessage(`❌ Error: ${errorMsg}`);
      setTimeout(() => setToastMessage(null), 5000);
      return {
        success: false,
        txHash: "",
        voucherId: activeVoucher.id,
        amount: activeVoucher.claimAmount,
        explorerUrl: "",
        error: errorMsg,
      };
    } finally {
      setIsClaiming(false);
    }
  };

  return {
    vouchers,
    activeVoucher,
    activeVoucherIndex,
    isClaiming,
    claimReceipt,
    toastMessage,
    nextVoucher,
    prevVoucher,
    claimActiveVoucher,
    dismissReceipt: () => setClaimReceipt(null),
    dismissToast: () => setToastMessage(null),
  };
}
