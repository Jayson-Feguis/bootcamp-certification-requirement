import { PublicKey } from "@solana/web3.js";
import localFont from 'next/font/local'

export const LEADERBOARD_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_LEADERBOARD_PROGRAM_ID as any
);

// "A7p31uAccXDCFgbb3VA92iS5LNE9vBA29HgjvmhJCxZT"
// "CKomVJRHhV6PKvkg2KuDsXnwzTJNXPy3KP42nFvvWwsF"
// "5JjaSMowjsJYbwvboNAde4Zx8eqhMGyKvAzwgRDwGbpp"

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

  PLAYMEGAMES: localFont({
    src: "../../../assets/fonts/PlaymegamesReguler-2OOee.ttf",
  }).style.fontFamily,
  BARRIECITO: "Barriecito",
};


export const GAME = [
  {
    TITLE: "tile",
    MODES: ["4x4", "6x6", "8x8"],
  },
];
