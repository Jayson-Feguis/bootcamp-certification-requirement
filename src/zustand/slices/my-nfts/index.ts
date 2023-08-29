import { NFT } from "@/hooks/useMetaflex";
import { IInitialState } from "@/types/global";
import { StateCreator } from "zustand";

export interface IMyNftsSlice {
  myNfts: IInitialState & { info: NFT[] };
  getMyNfts: (nfts: NFT[]) => void;
  addMyNfts: (nft: NFT) => void;
  resetMyNfts: () => void;
}

const initialState: IInitialState & { info: NFT[] } = {
  isLoading: false,
  isSuccess: false,
  info: [],
  responseMessage: null,
  updatedAt: null,
};

const objState = (data: any) => ({
  isLoading: data[0],
  isSuccess: data[1],
  info: data[2],
  responseMessage: data[3],
  updatedAt: data[4],
});

const myNftsSlice: StateCreator<IMyNftsSlice> = (set) => ({
  myNfts: initialState,
  getMyNfts: (nfts) => {
    set((state) => ({
      ...state,
      myNfts: objState([false, true, nfts, null, Date.now()]),
    }));
  },
  addMyNfts: (nft) => {
    set((state) => ({
      ...state,
      myNfts: objState([
        false,
        true,
        [...state.myNfts.info, nft],
        null,
        Date.now(),
      ]),
    }));
  },
  resetMyNfts: () => {
    set((state) => ({
      ...state,
      myNfts: objState([false, false, [], null, null]),
    }));
  },
});

export default myNftsSlice;
