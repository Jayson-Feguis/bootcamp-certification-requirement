import { useEffect, useCallback } from "react";
import { useConnection } from ".";
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
} from "@metaplex-foundation/js";
import { Keypair } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import useJsonStore from "@/zustand/store";
import { dateOffset } from "@/helpers/utils";

interface Attribute {
  trait_type: String;
  value: String;
}
export interface NFT {
  name: String;
  description: String;
  image: String;
  attributes: Attribute[];
}

function useMetaflex() {
  const { connection, endpoint } = useConnection();
  const { myNfts, getMyNfts } = useJsonStore();
  const { publicKey } = useWallet();

  const keypair = Keypair.generate();
  const metaplex = new Metaplex(connection).use(keypairIdentity(keypair)).use(
    bundlrStorage({
      address: "https://devnet.bundlr.network",
      providerUrl: endpoint,
      timeout: 60000,
    })
  );

  const getAllNFTs = useCallback(async () => {
    if (!publicKey) return;

    let nftArray: NFT[] = [];

    let raw = await metaplex.nfts().findAllByOwner({ owner: publicKey });
    console.log(raw);
    raw = raw.map((i: any) => i?.uri);

    for (const uri of raw) {
      const res = await fetch(uri);
      const data = await res.json();
      nftArray.push(data);
    }

    getMyNfts(nftArray);
  }, [publicKey, metaplex, getMyNfts]);

  useEffect(() => {
    if (!myNfts.updatedAt) getAllNFTs();
    if (new Date() > dateOffset(10000, myNfts.updatedAt as any)) getAllNFTs();
  }, [myNfts.updatedAt, getAllNFTs]);

  return { myNfts };
}

export default useMetaflex;
