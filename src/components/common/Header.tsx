"use client";
import React, { FC, useCallback, useEffect } from "react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { parseWalletError } from "@/helpers/utils";
import { useSnackbarContext } from "@/context";
import { CustomSelectWalletButton, CustomSnackbar } from "..";
import Link from "next/link";
import { AppBar, Box, Container } from "@mui/material";
import { COLOR, FONT } from "@/helpers/constants";
import { useRouter } from "next/router";
import useJsonStore from "@/zustand/store";
import Routes from "@/routes";

const Header: FC = () => {
  const router = useRouter();
  const { resetMyNfts } = useJsonStore();
  const { setSnackbar } = useSnackbarContext();
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected, connecting } = useWallet();

  useEffect(() => {
    if (!connecting && !publicKey) {
      if (!connected) {
        router.push(Routes.Game);
        resetMyNfts();
      } else {
        router.push(Routes.MyNFTs);
      }
    }
  }, [connecting]);

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
      <AppBar
        component="header"
        sx={{ background: COLOR.PRIMARY, boxShadow: "none" }}
      >
        <Container maxWidth="lg">
          <Box className="flex justify-between w-full py-3">
            <Box className={`!flex gap-5 items-center max-w-[400px]`}>
              <Link href={Routes.Game}>Play Games</Link>
              <Link href={Routes.Leaderboard}>Leaderboard</Link>
              {publicKey && <Link href={Routes.MyNFTs}>My NFTs</Link>}
            </Box>
            <CustomSelectWalletButton />
          </Box>
        </Container>
      </AppBar>
      {/* <button onClick={onClick} disabled={!publicKey}>
          {`Send SOL to a random address!`}
        </button> */}
      <CustomSnackbar />
    </>
  );
};

export default Header;
