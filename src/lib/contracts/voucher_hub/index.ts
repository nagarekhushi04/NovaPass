import { STELLAR_CONFIG } from "@/lib/stellar";

export interface VoucherHubContract {
  contractId: string;
  network: string;
  rpcUrl: string;
}

export const VoucherHubClient: VoucherHubContract = {
  contractId: STELLAR_CONFIG.contractId,
  network: STELLAR_CONFIG.network,
  rpcUrl: STELLAR_CONFIG.rpcUrl,
};

export interface IssueVoucherArgs {
  merchant: string;
  voucherType: number;
  totalSupply: bigint;
  claimAmount: bigint;
  metadataUri: string;
  expiresAt: bigint;
}

export interface ClaimVoucherArgs {
  voucherId: bigint;
  user: string;
}

export interface RedeemVoucherArgs {
  voucherId: bigint;
  merchant: string;
  user: string;
  amount: bigint;
}

export interface VoucherDetails {
  id: bigint;
  merchant: string;
  voucherType: number;
  totalSupply: bigint;
  remainingSupply: bigint;
  claimAmount: bigint;
  metadataUri: string;
  expiresAt: bigint;
  isActive: boolean;
}
