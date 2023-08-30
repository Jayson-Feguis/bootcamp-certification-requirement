import { useState, ChangeEvent, MouseEvent, useCallback } from "react";
import {
  CustomModal,
  CustomNftCard,
  CustomTextfield,
  PageHeader,
} from "@/components";
import { useMetaflex, useOpenElement } from "@/hooks";
import { IMetadata } from "@/types/global";
import {
  Button,
  Grid,
  Box,
  Typography,
  IconButton,
  Input,
  InputBase,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import _ from "lodash";
import { FaTrash } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { COLOR } from "@/helpers/constants";
import { useSnackbarContext } from "@/context";
import {
  computeSkeletonOpacity,
  generateNumberArray,
  parseWalletError,
} from "@/helpers/utils";

export default function MyNFTs() {
  const { publicKey, connected } = useWallet();
  const {
    myNfts,
    uploadNFTImage,
    uploadNFTMetadata,
    mintNFT,
    isLoading: isLoadingMetaflex,
  } = useMetaflex();
  const { open, onOpen, onClose } = useOpenElement();
  const { setSnackbar } = useSnackbarContext();

  const numberOfSkeleton = 4;

  const [metadata, setMetadata] = useState<any>({
    name: "",
    description: "",
    image: null,
    attributes: [{ trait_type: "", value: "" }],
  });
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Attributes
    if (name.includes(".")) {
      const attributes: any = metadata.attributes;
      const attName = name.split(".")[0];
      const attIndex = name.split(".")[1];

      attributes[attIndex][attName] = value;
      setMetadata((prev: any) => ({ ...prev, attributes }));
    } else {
      setMetadata((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const addAttribute = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setMetadata((prev: any) => ({
      ...prev,
      attributes: [...prev.attributes, { trait_type: "", value: "" }],
    }));
  };

  const removeAttribute = (id: number) => {
    setMetadata((prev: any) => ({
      ...prev,
      attributes: prev.attributes.filter((x: any, idx: number) => idx !== id),
    }));
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file: any = e.target?.files;
    if (!_.isEmpty(file))
      setMetadata((prev: any) => ({ ...prev, image: file[0] }));
  };

  const onMintNft = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      if (_.size(metadata.image) < 0) throw Error("Please upload NFT image");

      const nftImageUrl: string | any = await uploadNFTImage(
        metadata?.image as any
      );
      if (!nftImageUrl)
        throw Error("Error: Something went wrong in uploading NFT image");

      setMetadata((prev: any) => ({ ...prev, image: nftImageUrl }));

      await new Promise((r) => setTimeout(r, 1000));

      const nftMetadataUrl: string | any = await uploadNFTMetadata({
        ...metadata,
        image: nftImageUrl,
      });
      if (!nftMetadataUrl)
        throw Error("Error: Something went wrong in uploading NFT metadata");

      const { message, nft } = await mintNFT(nftMetadataUrl.uri, metadata);
      if (!nft) throw Error("Error: Something went wrong in minting your nft");

      setIsLoading(false);
      setSnackbar((prev: any) => ({
        ...prev,
        content: message,
        isShow: true,
        type: "success",
      }));
      onClose();
      setMetadata({
        name: "",
        description: "",
        image: null,
        attributes: [{ trait_type: "", value: "" }],
      });
    } catch (error: any) {
      setSnackbar((prev: any) => ({
        ...prev,
        content: parseWalletError(error),
        isShow: true,
        type: "error",
      }));
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="My NFTs"
        description="Discover Unique Digital Creations on My NFT Page"
        action={
          <Button
            onClick={onOpen}
            sx={{
              background: `${COLOR.PRIMARY} !important`,
              color: COLOR.WHITE,
            }}
          >
            Mint NFT
          </Button>
        }
      />
      <Grid container spacing={3}>
        {isLoadingMetaflex
          ? generateNumberArray(numberOfSkeleton).map((i) => (
              <Grid item key={`${i}`} xs={12} sm={6} md={4} lg={3}>
                <Box
                  className="flex flex-col gap-3 rounded-lg w-full overflow-hidden"
                  sx={{
                    background: COLOR.SECONDARY,
                    color: COLOR.WHITE,
                    opacity: computeSkeletonOpacity(numberOfSkeleton, i),
                  }}
                >
                  <Skeleton
                    key={`${i}`}
                    variant="rectangular"
                    width={1000}
                    height={270}
                    animation="wave"
                  />
                  <Box className="flex flex-col gap1 p-3">
                    <Skeleton height={40} />
                    <Skeleton />
                    <Skeleton width="60%" />
                  </Box>
                </Box>
              </Grid>
            ))
          : publicKey && connected && myNfts.info?.length > 0
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
      <CustomModal open={open}>
        <Box
          component="form"
          className="flex flex-col gap-3"
          sx={{ width: { xs: "100%", md: "600px" } }}
        >
          <Box className="w-full">
            <Typography variant="body1" className="text-white">
              Nft Image
            </Typography>
            <Input
              id="image-upload"
              type="file"
              onChange={onFileChange}
              inputProps={{
                accept: "image/jpeg, image/png, image/jpg",
              }}
              className="!text-white"
              disabled={isLoading}
            />
          </Box>

          <CustomTextfield
            name="name"
            placeholder="Type your nft name"
            onChange={onChange}
            value={metadata.name}
            disabled={isLoading}
          />
          <CustomTextfield
            name="description"
            placeholder="Description"
            rows={5}
            multiline
            onChange={onChange}
            value={metadata.description}
            disabled={isLoading}
          />
          <Box className="flex flex-col gap-3">
            <Box className="flex justify-between">
              <Typography variant="body1" className="text-white">
                Attributes
              </Typography>
              <Button
                variant="contained"
                onClick={addAttribute}
                size="small"
                className="text-white"
                endIcon={<AiOutlinePlus />}
                sx={{
                  background: `${COLOR.TERTIARY} !important`,
                }}
                disabled={isLoading}
              >
                Add
              </Button>
            </Box>
            <Box className="flex flex-col px-5 justify-start items-center max-h-[300px] overflow-auto gap-3">
              {_.size(metadata.attributes) > 0 ? (
                metadata.attributes.map((i: any, idx: number) => (
                  <Grid
                    container
                    key={`${idx}`}
                    columnGap={2}
                    className="flex justify-center items-end"
                  >
                    <Grid item xs={12} sm={5}>
                      <InputBase
                        name={`trait_type.${idx}`}
                        placeholder="Trait type"
                        onChange={onChange}
                        value={metadata.attributes[idx].trait_type}
                        disabled={isLoading}
                        className="!text-white !px-3 !py-1 !rounded-md !w-full"
                        sx={{ background: COLOR.PRIMARY }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <InputBase
                        name={`value.${idx}`}
                        placeholder="Value"
                        onChange={onChange}
                        value={metadata.attributes[idx].value}
                        disabled={isLoading}
                        className="!text-white !px-3 !py-1 !rounded-md !w-full"
                        sx={{ background: COLOR.PRIMARY }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={1}
                      className="flex items-end w-full h-full"
                    >
                      <IconButton
                        onClick={() => removeAttribute(idx)}
                        className="!text-red-900"
                        disabled={isLoading}
                      >
                        <FaTrash />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))
              ) : (
                <Typography
                  variant="body1"
                  className="text-white opacity-70 py-5"
                >
                  Note: Please add attributes
                </Typography>
              )}
            </Box>
          </Box>
          <Box className="flex w-[60%] justify-end gap-3 self-end mt-3">
            <Button
              variant="text"
              onClick={() => onClose()}
              sx={{
                color: COLOR.WHITE,
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={onMintNft}
              className="flex-1"
              disabled={
                !(
                  Object.keys(metadata).every((i: string | number) =>
                    _.isEqual(i, "image")
                      ? !_.isNil(metadata[i])
                      : _.size(metadata[i]) > 0
                  ) &&
                  metadata.attributes.every(
                    (i: any) => !_.isEmpty(i.trait_type) && !_.isEmpty(i.value)
                  )
                ) || isLoading
              }
              sx={{
                background: `${COLOR.YELLOW} !important`,
                color: `${COLOR.BLACK} !important`,
                opacity: 1,
                ":disabled": {
                  opacity: 0.3,
                  cursor: "not-allowed",
                },
              }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={16} className="mr-3" /> Minting
                </>
              ) : (
                "Mint NFT"
              )}
            </Button>
          </Box>
        </Box>
      </CustomModal>
    </>
  );
}
