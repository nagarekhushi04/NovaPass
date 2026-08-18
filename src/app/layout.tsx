import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NovaPass | Stellar Web3 Digital Voucher Platform",
  description:
    "Empower businesses to issue, manage, and redeem programmable digital vouchers, coupons, and loyalty points using Stellar Soroban smart contracts.",
  keywords: [
    "Stellar",
    "Soroban",
    "Web3",
    "Digital Vouchers",
    "Loyalty Points",
    "Smart Contracts",
    "Blockchain",
  ],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full w-full bg-black text-white antialiased overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
