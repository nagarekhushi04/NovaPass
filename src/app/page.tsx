"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { CinematicHero } from "@/components/CinematicHero";
import { ScanModal } from "@/components/ScanModal";
import { FeedbackModal } from "@/components/FeedbackModal";
import { ActivityModal } from "@/components/ActivityModal";
import { DetailsModal } from "@/components/DetailsModal";
import { useStellarWallet } from "@/hooks/useStellarWallet";
import { useVoucherContract } from "@/hooks/useVoucherContract";

export default function Home() {
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Web3 Stellar Wallet Hook
  const {
    address,
    walletName,
    isConnected,
    isLoading: isWalletLoading,
    connect: connectWallet,
    disconnect: disconnectWallet,
  } = useStellarWallet();

  // Soroban Voucher Contract Hook
  const {
    vouchers,
    activeVoucher,
    activeVoucherIndex,
    isClaiming,
    claimReceipt,
    toastMessage,
    nextVoucher,
    prevVoucher,
    claimActiveVoucher,
    dismissReceipt,
  } = useVoucherContract();

  const handleClaim = () => {
    if (!isConnected) {
      // Connect wallet first if not connected
      connectWallet();
      return;
    }
    claimActiveVoucher(address);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black text-white flex flex-col justify-between select-none">
      {/* 1. Fullscreen Background Video (z-index: 0) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_094145_4a271a6c-3869-4f1c-8aa7-aeb0cb227994.mp4"
          type="video/mp4"
        />
      </video>

      {/* 2. Bottom Blur Overlay with Mask (z-index: 1) */}
      <div
        className="bottom-blur-mask fixed inset-0 z-1 pointer-events-none"
        aria-hidden="true"
      />

      {/* 3. Top Navbar (z-index: 50) */}
      <Navbar
        walletAddress={address}
        walletName={walletName}
        isConnected={isConnected}
        isLoading={isWalletLoading}
        onConnectWallet={connectWallet}
        onDisconnectWallet={disconnectWallet}
        onOpenScanner={() => setIsScanModalOpen(true)}
        onOpenActivity={() => setIsActivityModalOpen(true)}
        onOpenFeedback={() => setIsFeedbackModalOpen(true)}
      />

      {/* 4. Cinematic Hero Section (z-index: 10) */}
      <CinematicHero
        voucher={activeVoucher}
        voucherIndex={activeVoucherIndex}
        totalVouchers={vouchers.length}
        isClaiming={isClaiming}
        claimReceipt={claimReceipt}
        toastMessage={toastMessage}
        onClaimVoucher={handleClaim}
        onNextVoucher={nextVoucher}
        onPrevVoucher={prevVoucher}
        onOpenDetails={() => setIsDetailsModalOpen(true)}
        onDismissReceipt={dismissReceipt}
        onOpenActivity={() => setIsActivityModalOpen(true)}
      />

      {/* Modals & Dialogs */}
      <ScanModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        userAddress={address}
      />

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        userAddress={address}
      />

      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
      />

      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onClaimCTA={handleClaim}
      />
    </main>
  );
}
