import React from "react";
import dynamic from "next/dynamic";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

function CustomSelectWalletButton() {
  return <WalletMultiButtonDynamic />;
}

export default CustomSelectWalletButton;
