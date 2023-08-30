import { useState, useEffect } from "react";
import { CustomSkeleton, TitleHeader } from "@/components";
import { useLeaderboard, useSelected } from "@/hooks";
import { Grid, Box, Typography, Button, Skeleton } from "@mui/material";
import useJsonStore from "@/zustand/store";
import _ from "lodash";
import {
  computeSkeletonOpacity,
  dateOffset,
  generateNumberArray,
  shortenAddress,
  toSentenceCase,
} from "@/helpers/utils";
import { COLOR, FONT, GAME } from "@/helpers/constants";
import { ILeaderboard } from "@/types/global";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Leaderboard() {
  const { leaderboard } = useJsonStore();
  const { isLoading, fetchLeaderboard, filterLeaderboard } = useLeaderboard();
  const { publicKey } = useWallet();
  const { selected: selectedGame, onSelect: onSelectGame } = useSelected(
    GAME[0]?.TITLE
  );
  const { selected: selectedTileMode, onSelect: onSelectTileMode } =
    useSelected(
      GAME.find((i: any) => _.isEqual(i.TITLE, selectedGame))?.MODES[0]
    );

  const [filteredLeaderboard, setFilteredLeaderboard] = useState<
    ILeaderboard[]
  >([]);

  const gridItemStyle = "flex items-center";
  const numberOfSkeleton = 5;

  useEffect(() => {
    if (!leaderboard.updatedAt) fetchLeaderboard();
    if (new Date() > dateOffset(10000, leaderboard.updatedAt as any))
      fetchLeaderboard();
  }, [publicKey]);

  useEffect(() => {
    if (_.size(leaderboard) > 0) setFilteredLeaderboard(filterLeaderboard());
  }, [leaderboard]);

  return (
    <Box className="flex flex-col items-center min-h-[calc(100vh-60px)] gap-10">
      <TitleHeader title="Leaderboard" />
      <Box className="flex flex-col gap-3 w-full">
        <Box className="flex flex-wrap gap-10">
          <Box className="flex flex-wrap flex-col">
            <Typography variant="body2" className="text-white">
              Game
            </Typography>
            <Box className="flex flex-wrap gap-3">
              {GAME.map((i: any) => (
                <Button
                  key={i.TITLE}
                  onClick={() => {
                    setFilteredLeaderboard(filterLeaderboard("tile", i));
                    onSelectTileMode(i);
                  }}
                  sx={{
                    background: _.isEqual(selectedGame, i.TITLE)
                      ? `${COLOR.YELLOW} !important`
                      : `${COLOR.SECONDARY} !important`,
                    color: _.isEqual(selectedGame, i.TITLE)
                      ? `${COLOR.BLACK} !important`
                      : `${COLOR.WHITE} !important`,
                    fontFamily: FONT.BARRIECITO,
                  }}
                >
                  {toSentenceCase(i.TITLE)}
                </Button>
              ))}
            </Box>
          </Box>
          <Box className="flex flex-wrap flex-col">
            <Typography variant="body2" className="text-white">
              Game Mode
            </Typography>
            <Box className="flex flex-wrap gap-3">
              {GAME.find((i: any) =>
                _.isEqual(i.TITLE, selectedGame)
              )?.MODES.map((i: any) => (
                <Button
                  key={i}
                  onClick={() => {
                    setFilteredLeaderboard(filterLeaderboard("tile", i));
                    onSelectTileMode(i);
                  }}
                  sx={{
                    background: _.isEqual(selectedTileMode, i)
                      ? `${COLOR.YELLOW} !important`
                      : `${COLOR.SECONDARY} !important`,
                    color: _.isEqual(selectedTileMode, i)
                      ? `${COLOR.BLACK} !important`
                      : `${COLOR.WHITE} !important`,
                    fontFamily: FONT.BARRIECITO,
                  }}
                >
                  {i}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>
        <Grid
          container
          rowGap={3}
          className="max-h-[calc(100vh-300px)] overflow-auto relative "
        >
          <Grid item xs={12} className="sticky top-0 z-10">
            <Grid
              container
              className="w-full flex justify-center text-white p-5 rounded-xl px-16"
              sx={{
                background: COLOR.TERTIARY,
                boxShadow: "0px 12px 22px -6px rgba(0,0,0,0.58)",
                WebkitBoxShadow: "0px 12px 22px -6px rgba(0,0,0,0.58)",
                MozBoxShadow: "0px 12px 22px -6px rgba(0,0,0,0.58)",
              }}
            >
              <Grid item xs={1} className={gridItemStyle}>
                Rank
              </Grid>
              <Grid item xs={5} className={gridItemStyle}>
                User
              </Grid>
              <Grid item xs={1} className={gridItemStyle}>
                Guess
              </Grid>
              <Grid item xs={1} className={gridItemStyle}>
                Time (s)
              </Grid>
              <Grid item xs={1} className={gridItemStyle}>
                Points
              </Grid>
            </Grid>
          </Grid>
          {isLoading ? (
            generateNumberArray(numberOfSkeleton).map((i) => (
              <Skeleton
                key={`${i}`}
                variant="rounded"
                width={1200}
                height={80}
                animation="wave"
                sx={{
                  opacity: computeSkeletonOpacity(numberOfSkeleton, i),
                }}
              />
            ))
          ) : _.size(filteredLeaderboard) > 0 ? (
            filteredLeaderboard.map((i: any, idx: number) => (
              <Grid item xs={12} key={`${idx}-${i.user}`} className="px-10">
                <Grid
                  container
                  className="w-full flex justify-center text-white p-5 rounded-xl"
                  sx={{
                    background: COLOR.SECONDARY,
                    border: `1px solid ${COLOR.SECONDARY}`,
                    transition: "all 0.2s ease",
                    opacity: 1,
                    ":hover": {
                      border: `1px solid ${COLOR.TERTIARY}`,
                      opacity: 0.9,
                      zIndex: 1,
                    },
                  }}
                >
                  <Grid item xs={1} className={gridItemStyle}>
                    <Box
                      className="flex rounded-full aspect-square w-10 justify-center items-center"
                      sx={{
                        background: COLOR.YELLOW,
                        fontFamily: FONT.PLAYMEGAMES,
                        color: COLOR.BLACK,
                      }}
                    >
                      {i.rank}
                    </Box>
                  </Grid>
                  <Grid item xs={5} className={gridItemStyle}>
                    <Typography className="truncate">
                      {shortenAddress(i.user)}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} className={gridItemStyle}>
                    <Typography>{i.guess}</Typography>
                  </Grid>
                  <Grid item xs={1} className={gridItemStyle}>
                    <Typography>{i.time}</Typography>
                  </Grid>
                  <Grid item xs={1} className={gridItemStyle}>
                    <Typography>{i.point}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            ))
          ) : (
            <Box className="flex flex-col justify-center text-center w-full">
              <Typography variant="h6" className="text-white py-5">
                0 Result(s)
              </Typography>
              <Typography variant="body1" className="text-white opacity-70">
                Log in to your account to view the leaderboard
              </Typography>
            </Box>
          )}
        </Grid>
      </Box>
    </Box>
  );
}
