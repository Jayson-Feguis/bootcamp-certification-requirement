import { useMemo } from "react";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

function useConnection() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const connection = new Connection(endpoint);

  return { connection, endpoint, network };
}

export default useConnection;
