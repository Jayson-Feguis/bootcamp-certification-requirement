import { IInitialState, ILeaderboard } from "@/types/global";
import { StateCreator } from "zustand";

export interface ILeaderboardSlice {
  leaderboard: IInitialState & { info: ILeaderboard[] };
  getLeaderboard: (data: ILeaderboard[]) => void;
  resetLeaderboard: () => void;
}

const initialState: IInitialState & { info: ILeaderboard[] } = {
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

const leaderboardSlice: StateCreator<ILeaderboardSlice> = (set) => ({
  leaderboard: initialState,
  getLeaderboard: (data) => {
    set((state) => ({
      ...state,
      leaderboard: objState([false, true, data, null, Date.now()]),
    }));
  },
  resetLeaderboard: () => {
    set((state) => ({
      ...state,
      leaderboard: objState([false, false, [], null, null]),
    }));
  },
});

export default leaderboardSlice;
