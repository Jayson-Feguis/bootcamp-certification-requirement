"use client";
import React, { FC, useEffect, useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { toSentenceCase } from "@/helpers/utils";
import { CustomSelectWalletButton, CustomSnackbar } from "..";
import Link from "next/link";
import { AppBar, Box, Container } from "@mui/material";
import { COLOR } from "@/helpers/constants";
import { useRouter } from "next/router";
import useJsonStore from "@/zustand/store";
import Routes from "@/routes";
import Head from "next/head";
import _ from "lodash";

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
  const { publicKey, connected, connecting } = useWallet();

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

  const renderHead = useMemo(
    () => (
      <Head>
        <title>{`JSON | ${toSentenceCase(
          _.isEqual(router.pathname, "/") ? "Play Games" : router.pathname
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
      <CustomSnackbar />
    </>
  );
};

export default Header;
