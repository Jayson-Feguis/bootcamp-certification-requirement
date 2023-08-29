import { create, State, StateCreator, StoreMutatorIdentifier } from "zustand";
import { persist } from "zustand/middleware";
import myNftsSlice, { IMyNftsSlice } from "../slices/my-nfts";
import leaderboardSlice, { ILeaderboardSlice } from "../slices/leaderboard";

type Logger = <
  T extends State,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  f: StateCreator<T, Mps, Mcs>,
  name?: string
) => StateCreator<T, Mps, Mcs>;

type LoggerImpl = <T extends State>(
  f: StateCreator<T, [], []>,
  name?: string
) => StateCreator<T, [], []>;

const loggerImpl: LoggerImpl = (f, name) => (set, get, store) => {
  type T = ReturnType<typeof f>;
  const loggedSet: typeof set = (...a) => {
    set(...a);
    console.log(...(name ? [`${name}:`] : []), get());
  };
  store.setState = loggedSet;

  return f(loggedSet, get, store);
};

export const logger = loggerImpl as unknown as Logger;

const useJsonStore = create(
  logger(
    persist<IMyNftsSlice & ILeaderboardSlice>(
      (...args) => ({
        ...myNftsSlice(...args),
        ...leaderboardSlice(...args),
      }),
      { name: "json-dapp" }
    )
  )
);
export default useJsonStore;
