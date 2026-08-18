"use client";

import React, { useState } from "react";
import { User, QrCode, Menu, X, Wallet, ShieldCheck, ExternalLink, Sparkles } from "lucide-react";

interface NavbarProps {
  walletAddress: string | null;
  walletName: string | null;
  isConnected: boolean;
  isLoading: boolean;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  onOpenScanner: () => void;
  onOpenActivity: () => void;
  onOpenFeedback: () => void;
}

export function Navbar({
  walletAddress,
  walletName,
  isConnected,
  isLoading,
  onConnectWallet,
  onDisconnectWallet,
  onOpenScanner,
  onOpenActivity,
  onOpenFeedback,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <nav className="relative z-50 flex items-center justify-between px-4 sm:px-6 md:px-12 py-4 md:py-6 w-full">
      {/* Left: Logo (0ms delay) */}
      <div
        className="animate-blur-fade-up flex items-center gap-2 cursor-pointer select-none"
        style={{ animationDelay: "0ms" }}
      >
        <div className="h-8 md:h-10 flex items-center">
          <span className="font-extrabold tracking-widest text-lg sm:text-xl md:text-2xl text-white">
            NOVA<span className="text-gray-400 font-light">PASS</span>
          </span>
          <span className="ml-2.5 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-white/10 text-gray-300 border border-white/15">
            Soroban
          </span>
        </div>
      </div>

      {/* Center Links (hidden below lg) - Stagger 100ms to 250ms */}
      <div className="hidden lg:flex items-center gap-8">
        <button
          onClick={onOpenActivity}
          className="animate-blur-fade-up text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
          style={{ animationDelay: "100ms" }}
        >
          Ecosystem
        </button>
        <button
          onClick={onOpenActivity}
          className="animate-blur-fade-up text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
          style={{ animationDelay: "150ms" }}
        >
          Vouchers
        </button>
        <button
          onClick={onOpenActivity}
          className="animate-blur-fade-up text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
          style={{ animationDelay: "200ms" }}
        >
          Loyalty Pools
        </button>
        <button
          onClick={onOpenFeedback}
          className="animate-blur-fade-up text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-1.5"
          style={{ animationDelay: "250ms" }}
        >
          <span>Feedback</span>
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Search/Scan Pill Button (300ms delay) */}
        <button
          onClick={onOpenScanner}
          className="animate-blur-fade-up liquid-glass flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium text-white group cursor-pointer"
          style={{ animationDelay: "300ms" }}
          title="Scan Voucher QR"
        >
          <QrCode className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
          <span className="hidden sm:inline">Scan / POS</span>
        </button>

        {/* Web3 Connect Profile Circle (350ms delay) */}
        <div className="relative">
          <button
            onClick={() => {
              if (isConnected) {
                setProfileDropdownOpen(!profileDropdownOpen);
              } else {
                onConnectWallet();
              }
            }}
            disabled={isLoading}
            className={`animate-blur-fade-up liquid-glass relative flex items-center justify-center w-10 h-10 rounded-full text-white cursor-pointer ${
              isConnected ? "ring-2 ring-emerald-500/40" : ""
            }`}
            style={{ animationDelay: "350ms" }}
            title={isConnected ? `Connected: ${walletAddress}` : "Connect Stellar Wallet"}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isConnected ? (
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            ) : (
              <User className="w-4 h-4 text-gray-300" />
            )}
          </button>

          {/* Profile Popover / Dropdown */}
          {isConnected && profileDropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 liquid-glass bg-black/90 backdrop-blur-2xl rounded-2xl p-4 shadow-2xl border border-white/10 z-50 animate-blur-fade-up">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-white">Stellar Testnet</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>

              <div className="py-3 space-y-1.5">
                <p className="text-[11px] text-gray-400">Connected Wallet</p>
                <p className="text-xs font-mono text-white truncate bg-white/5 p-1.5 rounded-lg border border-white/5">
                  {walletAddress}
                </p>
                <p className="text-[11px] text-gray-400 mt-2">Provider: {walletName}</p>
              </div>

              <div className="pt-2 border-t border-white/10 space-y-2">
                <a
                  href={`https://stellar.expert/explorer/testnet/account/${walletAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between text-xs text-gray-300 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
                >
                  <span>View on Explorer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onDisconnectWallet();
                  }}
                  className="w-full text-center text-xs font-medium text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Hamburger Menu (below lg only, 350ms delay) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden animate-blur-fade-up liquid-glass flex items-center justify-center w-10 h-10 rounded-full text-white cursor-pointer"
          style={{ animationDelay: "350ms" }}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Slide-in Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-[72px] left-4 right-4 z-40 bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-800 p-6 space-y-4 animate-blur-fade-up shadow-2xl">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenActivity();
              }}
              className="text-left text-sm font-medium text-gray-300 hover:text-white py-2 border-b border-gray-800"
            >
              Ecosystem
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenActivity();
              }}
              className="text-left text-sm font-medium text-gray-300 hover:text-white py-2 border-b border-gray-800"
            >
              Vouchers
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenActivity();
              }}
              className="text-left text-sm font-medium text-gray-300 hover:text-white py-2 border-b border-gray-800"
            >
              Loyalty Pools
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenFeedback();
              }}
              className="text-left text-sm font-medium text-gray-300 hover:text-white py-2 border-b border-gray-800"
            >
              Feedback & Ratings
            </button>
          </div>

          <div className="pt-2">
            {!isConnected ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onConnectWallet();
                }}
                className="w-full py-3 rounded-xl bg-white text-black font-semibold text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Stellar Wallet</span>
              </button>
            ) : (
              <div className="space-y-2">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs font-mono text-gray-300 truncate">
                  {walletAddress}
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onDisconnectWallet();
                  }}
                  className="w-full py-2.5 rounded-xl bg-red-500/10 text-red-400 font-medium text-xs border border-red-500/20"
                >
                  Disconnect Wallet
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
