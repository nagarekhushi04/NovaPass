import { NextRequest, NextResponse } from "next/server";
import {
  Horizon,
  Keypair,
  Networks,
  TransactionBuilder,
  Transaction,
  FeeBumpTransaction,
} from "@stellar/stellar-sdk";
import { STELLAR_CONFIG } from "@/lib/stellar";

export async function POST(req: NextRequest) {
  try {
    const { xdr } = await req.json();

    if (!xdr) {
      return NextResponse.json(
        { error: "Missing inner transaction XDR" },
        { status: 400 }
      );
    }

    // Sponsor keypair from server secret or ephemeral sponsored account
    const sponsorKeypair = process.env.STELLAR_SPONSOR_SECRET
      ? Keypair.fromSecret(process.env.STELLAR_SPONSOR_SECRET)
      : Keypair.random();

    // Ensure sponsor account exists on testnet
    const server = new Horizon.Server(STELLAR_CONFIG.horizonUrl);
    try {
      await server.loadAccount(sponsorKeypair.publicKey());
    } catch {
      await fetch(
        `${STELLAR_CONFIG.friendbotUrl}?addr=${encodeURIComponent(
          sponsorKeypair.publicKey()
        )}`
      );
    }

    const innerTx = TransactionBuilder.fromXDR(
      xdr,
      STELLAR_CONFIG.networkPassphrase
    ) as Transaction;

    // Build Fee-Bump Transaction sponsoring the inner tx
    const feeBumpTx = TransactionBuilder.buildFeeBumpTransaction(
      sponsorKeypair,
      "200", // fee in stroops
      innerTx,
      STELLAR_CONFIG.networkPassphrase
    );

    feeBumpTx.sign(sponsorKeypair);

    // Submit transaction to Stellar Testnet
    const response = await server.submitTransaction(feeBumpTx);

    return NextResponse.json({
      success: true,
      hash: response.hash,
      ledger: response.ledger,
      explorerUrl: `${STELLAR_CONFIG.explorerUrl}/tx/${response.hash}`,
    });
  } catch (error: any) {
    console.error("Relayer sponsor error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to sponsor transaction" },
      { status: 500 }
    );
  }
}
