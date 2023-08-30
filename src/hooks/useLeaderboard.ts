import { useMemo, useState, useCallback } from "react";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { LEADERBOARD_PROGRAM_ID } from "@/helpers/constants";
import leaderboardIdl from "@/assets/json/idl.json";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { SystemProgram } from "@solana/web3.js";
import { useSnackbarContext } from "@/context";
import { parseWalletError } from "@/helpers/utils";
import _ from "lodash";
import useJsonStore from "@/zustand/store";

function useLeaderboard() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();
  const { setSnackbar } = useSnackbarContext();
  const { leaderboard, getLeaderboard } = useJsonStore();

  const [initialized, setInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(
        connection,
        anchorWallet,
        anchor.AnchorProvider.defaultOptions()
      );
      return new anchor.Program(
        leaderboardIdl as any,
        LEADERBOARD_PROGRAM_ID,
        provider
      );
    }
  }, [connection, anchorWallet]);

  const initializeUser = useCallback(async () => {
    if (program && publicKey) {
      try {
        setIsLoading(true);
        const [userProfilePda] = findProgramAddressSync(
          [utf8.encode("USER_PROFILE"), publicKey.toBuffer()],
          program.programId
        );

        const userProfile: any = await program.account.userProfile
          .fetch(userProfilePda)
          .catch(() => "Not Initialized");

        if (_.isEqual(userProfile, "Not Initialized"))
          await program.methods
            .initializeUser()
            .accounts({
              userProfile: userProfilePda,
              user: publicKey,
              systemProgram: SystemProgram.programId,
            })
            .rpc();

        setInitialized(true);
        setSnackbar((prev) => ({
          ...prev,
          content: "Successfully initialized user",
          isShow: true,
          type: "success",
        }));
        setIsLoading(false);
        return true;
      } catch (error: any) {
        setSnackbar((prev) => ({
          ...prev,
          content: parseWalletError(error),
          isShow: true,
          type: "error",
        }));
        setIsLoading(false);
        setInitialized(false);
        return false;
      }
    }
  }, [program, publicKey]);

  const fetchLeaderboard = useCallback(async () => {
    if (program && publicKey) {
      try {
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 2000));
        let leaderboardAccount: any =
          await program.account.leaderboardAccount.all(); // all([authorFilter(publicKey.toString())])

        leaderboardAccount = leaderboardAccount
          .map((i: any) => ({ ...i.account, user: i.account.user.toString() }))
          .sort((a: any, b: any) => b.point - a.point);

        getLeaderboard(leaderboardAccount);
        setSnackbar((prev) => ({
          ...prev,
          content: "Successfully fetched leaderboard",
          isShow: true,
          type: "success",
        }));
        setIsLoading(false);
      } catch (error: any) {
        setSnackbar((prev) => ({
          ...prev,
          content: parseWalletError(error),
          isShow: true,
          type: "error",
        }));
        setIsLoading(false);
      }
    }
  }, [program, publicKey]);

  const addLeaderboard = useCallback(
    async (
      game: String,
      mode: String,
      point: number,
      time: number,
      guess: number
    ) => {
      if (program && publicKey) {
        try {
          setIsLoading(true);
          const [userProfilePda] = findProgramAddressSync(
            [utf8.encode("USER_PROFILE"), publicKey.toBuffer()],
            program.programId
          );

          const userProfile: any = await program.account.userProfile.fetch(
            userProfilePda
          );

          const [leaderboardAccountPda] = findProgramAddressSync(
            [
              utf8.encode("LEADERBOARD_ACCOUNT"),
              publicKey.toBuffer(),
              Uint8Array.from([userProfile.gamesPlayed]),
            ],
            program.programId
          );

          await program.methods
            .addLeaderboard(game, mode, point, time, guess)
            .accounts({
              user: publicKey,
              userProfile: userProfilePda,
              leaderboardAccount: leaderboardAccountPda,
              systemProgram: SystemProgram.programId,
            })
            .rpc();

          setSnackbar((prev) => ({
            ...prev,
            content: "Game saved!",
            isShow: true,
            type: "success",
          }));
          setIsLoading(false);
          return true;
        } catch (error: any) {
          setSnackbar((prev) => ({
            ...prev,
            content: parseWalletError(error),
            isShow: true,
            type: "error",
          }));
          setIsLoading(false);
          return false;
        }
      }
    },
    [program, publicKey]
  );

  const filterLeaderboard = useCallback(
    (game = "tile", mode = "4x4") => {
      let leaderboardAccount =
        _.size(leaderboard.info) > 0 ? leaderboard.info : [];
      if (_.size(leaderboardAccount) > 0) {
        leaderboardAccount = leaderboardAccount
          .filter(
            (i: any) => _.isEqual(i.game, game) && _.isEqual(i.mode, mode)
          )
          .map((i: any, idx: number) => ({ ...i, rank: idx + 1 }));
      }
      return leaderboardAccount;
    },
    [leaderboard.info]
  );

  return useMemo(
    () => ({
      isLoading,
      initialized,
      initializeUser,
      fetchLeaderboard,
      addLeaderboard,
      filterLeaderboard,
    }),
    [publicKey, program, isLoading, initialized]
  );
}

export default useLeaderboard;
