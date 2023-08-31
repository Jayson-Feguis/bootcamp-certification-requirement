import { PublicKey } from "@solana/web3.js";
import localFont from "next/font/local";

const playMeGames = localFont({
  src: "../assets/fonts/PlaymegamesReguler-2OOee.ttf",
});

export const LEADERBOARD_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_LEADERBOARD_PROGRAM_ID as any
);

export const COLOR = {
  PRIMARY: "#11141E",
  SECONDARY: "#1A1F2E",
  TERTIARY: "#2C2D30",

  WHITE: "#FFFFFF",
  BLACK: "#000000",
  YELLOW: "#FFC107",
};

export const FONT = {
  PRIMARY: "Poppins",

  PLAYMEGAMES: playMeGames.style.fontFamily,
  BARRIECITO: "Barriecito",
};

export const GAME = [
  {
    TITLE: "tile",
    MODES: ["4x4", "6x6", "8x8"],
  },
];
