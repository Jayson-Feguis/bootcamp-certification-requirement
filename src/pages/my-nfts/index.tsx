import { CustomModal, CustomNftCard, PageHeader } from "@/components";
import { useMetaflex, useOpenElement } from "@/hooks";
import { Button, Grid, Box } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";

export default function MyNFTs() {
  const { publicKey, connected } = useWallet();
  const { myNfts } = useMetaflex();
  const { open, onOpen, onClose } = useOpenElement();

  return (
    <>
      <PageHeader
        title="My NFTs"
        description="All about my NFTs"
        action={<Button onClick={onOpen}>Mint NFT</Button>}
      />
      <Grid container spacing={3} className="min-h-screen">
        {publicKey && connected && myNfts.info?.length > 0
          ? myNfts?.info?.map((nft, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={`${index}-${nft.image}` as any}
              >
                <CustomNftCard
                  name={`${nft.name}`}
                  image={`${nft.image}`}
                  description={`${nft.description}`}
                />
              </Grid>
            ))
          : null}
      </Grid>
      <CustomModal open={open} onClose={onClose}>
        <Box component="form">Hello Modal</Box>
      </CustomModal>
    </>
  );
}
