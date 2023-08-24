import React, { FC, ReactNode } from "react";
import { Wallet, Header } from "..";
import ContextProvider from "@/context";

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <ContextProvider>
      <Wallet>
        <Header />
        {children}
      </Wallet>
    </ContextProvider>
  );
};

export default Layout;
