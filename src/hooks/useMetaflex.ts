import { useConnection } from ".";
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { Keypair } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

function useMetaflex() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const getAllNFTs = async () => {
    const keypair = Keypair.generate();

    const metaplex = new Metaplex(connection);
    metaplex.use(keypairIdentity(keypair));
    return await metaplex.nfts().findAllByOwner(publicKey);
  };

  return { getAllNFTs };
}

export default useMetaflex;
