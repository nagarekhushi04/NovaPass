"use client";

import { useState, useEffect, useCallback } from "react";
import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  FREIGHTER_ID,
} from "@creit.tech/stellar-wallets-kit";
import { getAccountBalance } from "@/lib/stellar";

export interface WalletState {
  address: string | null;
  balance: string;
  isConnected: boolean;
  isLoading: boolean;
  walletName: string | null;
  error: string | null;
}

let kitInstance: StellarWalletsKit | null = null;

function getKit(): StellarWalletsKit {
  if (!kitInstance) {
    kitInstance = new StellarWalletsKit({
      network: WalletNetwork.TESTNET,
      selectedWalletId: FREIGHTER_ID,
      modules: allowAllModules(),
    });
  }
  return kitInstance;
}

export function useStellarWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    balance: "0.0000000",
    isConnected: false,
    isLoading: false,
    walletName: null,
    error: null,
  });

  const refreshBalance = useCallback(async (address: string) => {
    try {
      const balance = await getAccountBalance(address);
      setWalletState((prev) => ({ ...prev, balance }));
    } catch (e: any) {
      console.error("Error fetching live on-chain balance:", e);
      setWalletState((prev) => ({ ...prev, error: e?.message || "Failed to load balance" }));
    }
  }, []);

  // Load saved session on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem("novapass_wallet_address");
    const savedWallet = localStorage.getItem("novapass_wallet_name");

    if (savedAddress) {
      setWalletState((prev) => ({
        ...prev,
        address: savedAddress,
        walletName: savedWallet || "Stellar Wallet",
        isConnected: true,
      }));
      refreshBalance(savedAddress);
    }
  }, [refreshBalance]);

  const connect = useCallback(async () => {
    setWalletState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      if (typeof window === "undefined") {
        throw new Error("Window environment not initialized");
      }

      const kit = getKit();
      await kit.openModal({
        onWalletSelected: async (option) => {
          try {
            kit.setWallet(option.id);
            const { address } = await kit.getAddress();

            if (!address) {
              throw new Error("No address returned from selected wallet provider.");
            }

            localStorage.setItem("novapass_wallet_address", address);
            localStorage.setItem("novapass_wallet_name", option.name);

            setWalletState({
              address,
              balance: "0.0000000",
              isConnected: true,
              isLoading: false,
              walletName: option.name,
              error: null,
            });

            await refreshBalance(address);
          } catch (err: any) {
            console.error("Live wallet selection error:", err);
            setWalletState((prev) => ({
              ...prev,
              isLoading: false,
              error: err?.message || "Failed to connect to real Web3 wallet",
            }));
          }
        },
        onClosed: () => {
          setWalletState((prev) => ({ ...prev, isLoading: false }));
        },
      });
    } catch (err: any) {
      console.error("Stellar Wallets Kit modal error:", err);
      setWalletState((prev) => ({
        ...prev,
        isLoading: false,
        error: err?.message || "Wallet connection rejected or unavailable",
      }));
    }
  }, [refreshBalance]);

  const disconnect = useCallback(() => {
    localStorage.removeItem("novapass_wallet_address");
    localStorage.removeItem("novapass_wallet_name");
    setWalletState({
      address: null,
      balance: "0.0000000",
      isConnected: false,
      isLoading: false,
      walletName: null,
      error: null,
    });
  }, []);

  return {
    ...walletState,
    connect,
    disconnect,
    refreshBalance: () => walletState.address && refreshBalance(walletState.address),
  };
}
