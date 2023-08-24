"use client";
import React, { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { useSnackbarContext } from "@/context";
import { useConnection } from "@/hooks";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

interface Props {
  children: ReactNode;
}

const Wallet: FC<Props> = ({ children }) => {
  const { setSnackbar } = useSnackbarContext();
  const { endpoint, network } = useConnection();
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.

  const wallets = useMemo(
    () => [new PhantomWalletAdapter()],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        autoConnect
        onError={(error) =>
          setSnackbar((prev) => ({
            ...prev,
            isShow: true,
            content: error.toString(),
            type: "error",
          }))
        }
      >
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default Wallet;
