import React, { FC, ReactNode } from "react";
import { Wallet, Header } from "..";
import ContextProvider from "@/context";
import { Box, Container } from "@mui/material";
import { COLOR } from "@/helpers/constants";

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <ContextProvider>
      <Wallet>
        <Header />
        <Box className={`!bg-[#11141E] min-h-screen`}>
          <Container maxWidth="lg" className="pt-[60px] relative">
            {children}
          </Container>
        </Box>
      </Wallet>
    </ContextProvider>
  );
};

export default Layout;
