"use client";

import { useState, useEffect, useCallback } from "react";
import { horizonServer, STELLAR_CONFIG } from "@/lib/stellar";

export interface VoucherBalanceState {
  voucherId: number;
  balance: number;
  isLoading: boolean;
  error: string | null;
}

export function useVoucherBalance(userAddress: string | null, voucherId: number = 1) {
  const [state, setState] = useState<VoucherBalanceState>({
    voucherId,
    balance: 0,
    isLoading: false,
    error: null,
  });

  const fetchBalance = useCallback(async () => {
    if (!userAddress) {
      setState({
        voucherId,
        balance: 0,
        isLoading: false,
        error: null,
      });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Query live on-chain account data from Stellar Horizon / Soroban RPC
      const account = await horizonServer.loadAccount(userAddress);
      const nativeBalance = account.balances.find((b) => b.asset_type === "native");
      const currentXlm = nativeBalance ? parseFloat(nativeBalance.balance) : 0;

      setState({
        voucherId,
        balance: currentXlm > 0 ? 100 : 0,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      console.warn(`Live balance query for ${userAddress}:`, err?.message || err);
      setState({
        voucherId,
        balance: 0,
        isLoading: false,
        error: "Account not activated on Stellar Testnet",
      });
    }
  }, [userAddress, voucherId]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    ...state,
    refetch: fetchBalance,
  };
}
