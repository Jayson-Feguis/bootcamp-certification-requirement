import { useEffect, useCallback, useMemo } from "react";
import { useConnection } from ".";
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  MetaplexFile,
  MetaplexFileContent,
  toMetaplexFile,
  walletAdapterIdentity,
  NFT,
} from "@metaplex-foundation/js";
import { Keypair } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
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
  const { myNfts, getMyNfts, addMyNfts } = useJsonStore();
  const wallet = useWallet();

  const metaplex = useMemo(
    () =>
      new Metaplex(connection).use(walletAdapterIdentity(wallet)).use(
        bundlrStorage({
          address: "https://devnet.bundlr.network",
          providerUrl: endpoint,
          timeout: 60000,
        })
      ),
    [connection, wallet]
  );

  useEffect(() => {
    if (!myNfts.updatedAt) getAllNFTs();
    if (new Date() > dateOffset(10000, myNfts.updatedAt as any)) getAllNFTs();
  }, []);

  const getAllNFTs = useCallback(async () => {
    if (!wallet.publicKey) return;

    let nftArray: NFT[] = [];

    let raw = await metaplex.nfts().findAllByOwner({ owner: wallet.publicKey });
    raw = raw.map((i: any) => i?.uri);

    for (const uri of raw) {
      const res = await fetch(uri.toString());
      const data = await res.json();
      nftArray.push(data);
    }

    getMyNfts(nftArray);
  }, [wallet, metaplex, getMyNfts]);

  const uploadNFTImage = useCallback(
    async (image: File) =>
      new Promise((resolve, reject) => {
        try {
          let reader = new FileReader();
          const fileData = new Blob([image]);

          reader.readAsArrayBuffer(fileData);

          reader.onload = async function () {
            const arrayBuffer: any = reader.result;

            const file = toMetaplexFile(arrayBuffer, "nft.jpg");
            const imageUrl = await metaplex
              .storage()
              .upload(file)
              .catch((error) => reject(error));
            resolve(imageUrl);
          };
        } catch (error) {
          reject(error);
        }
      }),
    [metaplex]
  );
  const uploadNFTMetadata = useCallback(
    async (metadata: any) => {
      const metadataUrl = await metaplex.nfts().uploadMetadata(metadata);
      return metadataUrl;
    },
    [metaplex]
  );

  const mintNFT = useCallback(async (metadataURI: string, metadata: any) => {
    const nft: any = await metaplex
      .nfts()
      .create(
        {
          uri: metadataURI,
          name: metadata.name,
          sellerFeeBasisPoints: 5000,
        },
        { commitment: "finalized" }
      )
      .catch((e) => console.log(e));

    if (nft) {
      addMyNfts(nft.nft.json);
      return { message: "NFT minted successfully", nft };
    } else {
      // Handle the case where nft is undefined or null
      console.log("NFT creation failed");
      return { message: "NFT creation failed" };
    }
  }, []);

  return { myNfts, uploadNFTImage, uploadNFTMetadata, mintNFT };
}

export default useMetaflex;
