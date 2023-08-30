"use client";
import React, { FC, useCallback, useEffect, useMemo } from "react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { parseWalletError, toSentenceCase } from "@/helpers/utils";
import { useSnackbarContext } from "@/context";
import { CustomSelectWalletButton, CustomSnackbar } from "..";
import Link from "next/link";
import { AppBar, Box, Container } from "@mui/material";
import { COLOR } from "@/helpers/constants";
import { useRouter } from "next/router";
import useJsonStore from "@/zustand/store";
import Routes from "@/routes";
import Head from "next/head";
import _ from "lodash";
import jsonIcon from "@/assets/images/icon.ico";

const pages = [
  {
    title: "Play Games",
    route: Routes.Game,
  },
  {
    title: "Leaderboard",
    route: Routes.Leaderboard,
  },
  {
    title: "My NFTs",
    route: Routes.MyNFTs,
  },
];

const Header: FC = () => {
  const router = useRouter();
  const { resetMyNfts, resetLeaderboard } = useJsonStore();
  const { setSnackbar } = useSnackbarContext();
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected, connecting } = useWallet();

  useEffect(() => {
    if (!connecting && !publicKey) {
      if (!connected) {
        router.push(Routes.Game);
        resetMyNfts();
        resetLeaderboard();
      } else {
        router.push(Routes.MyNFTs);
      }
    }
  }, [publicKey, connecting]);

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

  const renderHead = useMemo(
    () => (
      <Head>
        <title>{`JSON | ${toSentenceCase(
          _.isEqual(router.pathname, "/") ? "Home" : router.pathname
        )}`}</title>
        <meta
          name="JSON"
          content="NFT and Game dApp using NextJS and Anchor Framework with Solana Blockchain"
        />
        <link rel="shortcut icon" href="/icon.ico" />
      </Head>
    ),
    [router.pathname]
  );

  const linkStyle = "transition-all duration-[0.2s] ease hover:!text-[#FFC107]";

  return (
    <>
      {renderHead}
      <AppBar
        component="header"
        sx={{ background: COLOR.PRIMARY, boxShadow: "none", zIndex: 1039 }}
      >
        <Container maxWidth="lg">
          <Box className="flex justify-between w-full py-3">
            <Box className={`!flex gap-5 items-center max-w-[400px]`}>
              {pages.map((i) =>
                _.isEqual(i.route, Routes.MyNFTs) ? (
                  publicKey && (
                    <Link key={i.title} href={i.route} className={linkStyle}>
                      {i.title}
                    </Link>
                  )
                ) : (
                  <Link key={i.title} href={i.route} className={linkStyle}>
                    {i.title}
                  </Link>
                )
              )}
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
