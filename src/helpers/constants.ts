import { PublicKey } from "@solana/web3.js";

export const LEADERBOARD_PROGRAM_ID = new PublicKey(
  "76ksujnwvqsPq2V9gfKYgRn1adzw4XifKncbstfSxLCb"
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

  PLAYMEGAMES: "PlaymegamesReguler-2OOee",
  BARRIECITO: "Barriecito",
};

export const GAME = {
  TILE: {
    MODES: ["4x4", "6x6", "8x8"],
  },
};