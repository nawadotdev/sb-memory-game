"use client"

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { useMemo } from "react"

const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY

export function SolanaWalletProvider({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(() => `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`, [])

  const wallets = useMemo(
    () => [
    ],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
