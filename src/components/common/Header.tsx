"use client";
import React, { FC, useCallback } from "react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import dynamic from "next/dynamic";
import { parseWalletError } from "@/helpers/utils";
import { useSnackbarContext } from "@/context";
import { CustomSnackbar } from "..";
import Link from "next/link";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const Header: FC = () => {
  const { setSnackbar } = useSnackbarContext();
  const { connection } = useConnection();
  const { publicKey, sendTransaction, wallet } = useWallet();

  const onClick = useCallback(async () => {
    try {
      if (!publicKey) throw new WalletNotConnectedError();

      // 890880 lamports as of 2022-09-01
      const lamports = await connection.getMinimumBalanceForRentExemption(0);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: Keypair.generate().publicKey,
          lamports,
        })
      );

      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();

      const signature = await sendTransaction(transaction, connection, {
        minContextSlot,
      });

      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });
    } catch (error: any) {
      setSnackbar(() => ({
        isShow: true,
        content: parseWalletError(error.toString()),
        type: "error",
      }));
    }
  }, [publicKey, sendTransaction, connection, setSnackbar]);

  return (
    <>
      <header>
        <Link href="/">Home</Link>
        <WalletMultiButtonDynamic />
        {/* {wallet && <WalletDisconnectButtonDynamic />} */}
        <button onClick={onClick} disabled={!publicKey}>
          {`Send SOL to a random address!`}
        </button>
        {publicKey && <Link href="/my-account">My Account</Link>}
      </header>
      <CustomSnackbar />
    </>
  );
};

export default Header;
