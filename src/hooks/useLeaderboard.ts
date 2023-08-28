import { useMemo, useState, useEffect } from "react";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { LEADERBOARD_PROGRAM_ID } from "@/helpers/constants";
import leaderboardIdl from "@/helpers/idl.json";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { SystemProgram } from "@solana/web3.js";
import { useSnackbarContext } from "@/context";
import { authorFilter, dateOffset, parseWalletError } from "@/helpers/utils";
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

  useEffect(() => {
    if (!leaderboard.updatedAt) fetchLeaderboard();
    if (new Date() > dateOffset(10000, leaderboard.updatedAt as any))
      fetchLeaderboard();
  }, []);

  const initializeUser = async () => {
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
  };

  const fetchLeaderboard = async () => {
    if (program && publicKey) {
      try {
        setIsLoading(true);
        let leaderboardAccount: any =
          await program.account.leaderboardAccount.all(); // all([authorFilter(publicKey.toString())])

        leaderboardAccount = leaderboardAccount
          .map((i: any) => ({ ...i.account, user: i.account.user.toString() }))
          .sort((a: any, b: any) => b.point - a.point)
          .map((i: any, idx: number) => ({ ...i, rank: idx + 1 }));

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
  };

  const addLeaderboard = async (
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
  };

  return {
    isLoading,
    initialized,
    initializeUser,
    fetchLeaderboard,
    addLeaderboard,
  };
}

export default useLeaderboard;
