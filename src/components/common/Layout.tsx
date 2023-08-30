import React, { FC, ReactNode } from "react";
import { Wallet, Header } from "..";
import ContextProvider from "@/context";
import { Box, Container } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import customTheme from "@/theme";

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <ContextProvider>
      <ThemeProvider theme={customTheme}>
        <Wallet>
          <Header />
          <Box className={`!bg-[#11141E] min-h-screen`}>
            <Container maxWidth="lg" className="pt-[100px] relative">
              {children}
            </Container>
          </Box>
        </Wallet>
      </ThemeProvider>
    </ContextProvider>
  );
};

export default Layout;
